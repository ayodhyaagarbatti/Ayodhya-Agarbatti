import { adminDb, FieldValue } from './_firebaseAdmin.js';
import { computeCartTotal } from './_shopPricing.js';

// Firestore rules deny client writes to `orders` (it holds customer PII and is only
// readable through api/admin-data.js), so every shop order is written here with the
// Admin SDK. Totals and line items always come from the server's own catalog
// pricing, never the browser.
//
// Online orders are recorded in two steps so a payment can never go unrecorded:
// create-shop-order.js saves the checkout to pending_payments/{razorpayOrderId}
// before the customer pays, and finalizeShopPayment() turns it into an order. That
// is called by whichever arrives first - the customer's browser (verify-payment.js)
// or Razorpay's webhook (_razorpayWebhook.js) - and is idempotent, so the second
// one is a no-op.
const str = (value, max = 300) => (value == null ? '' : String(value).slice(0, max).trim());

const istDate = () => new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
});

const currencySymbol = (currency) => (currency === 'USD' ? '$' : '₹');

const hasCustomer = (customer) => Boolean(customer && (customer.firstName || customer.street || customer.phone || customer.email));

const serializeTimestamps = (data) => {
    const out = { ...data };
    for (const key of Object.keys(out)) {
        if (out[key]?.toMillis) out[key] = out[key].toMillis();
    }
    return out;
};

// `payment` is Razorpay's payment entity, when known - its email/contact fill any
// gaps in what the customer typed at checkout.
export const cleanCustomer = (customer = {}, paymentMethod, payment = null) => {
    const firstName = str(customer.firstName, 100);
    const lastName = str(customer.lastName, 100);
    const street = str(customer.street, 500);
    const city = str(customer.city, 100);
    const pincode = str(customer.pincode, 20);
    return {
        name: `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        address: [street, [city, pincode].filter(Boolean).join(' - ')].filter(Boolean).join(', '),
        street,
        city,
        pincode,
        phone: str(customer.phone, 30) || str(payment?.contact, 30),
        email: str(customer.email, 200) || str(payment?.email, 200),
        paymentMethod
    };
};

const cleanCartLines = (cartItems) => (Array.isArray(cartItems) ? cartItems.slice(0, 50) : []).map((line) => ({
    id: Number(line?.id) || null,
    selectedPackName: line?.selectedPackName ? str(line.selectedPackName, 120) : null,
    quantity: Math.max(1, Number(line?.quantity) || 1)
}));

const toDisplayItems = (pricing) => pricing.lines.map((line) => ({
    id: line.id,
    name: line.name,
    variant: line.variant,
    pack: line.pack,
    price: `${currencySymbol(pricing.currency)}${line.unitPrice}`,
    unitPrice: line.unitPrice,
    quantity: line.quantity,
    image: line.image
}));

// Last resort only: the browser's own copy of the items, used when the cart can't
// be priced any more (e.g. a product was removed from the catalog mid-checkout).
const cleanClientItems = (items) => (Array.isArray(items) ? items.slice(0, 100) : []).map((item) => ({
    id: item?.id ?? null,
    name: str(item?.name, 200),
    variant: str(item?.variant, 200),
    pack: str(item?.pack || item?.selectedPackName, 120),
    price: str(item?.price, 50),
    quantity: Math.max(1, Number(item?.quantity) || 1),
    image: str(item?.image, 500)
}));

export const savePendingShopCheckout = async ({ razorpayOrder, orderNumber, cartItems, customer, pricing }) => {
    await adminDb().collection('pending_payments').doc(razorpayOrder.id).set({
        kind: 'shop',
        status: 'created',
        orderNumber: str(orderNumber, 60),
        razorpayOrderId: razorpayOrder.id,
        cartLines: cleanCartLines(cartItems),
        items: toDisplayItems(pricing),
        customer: hasCustomer(customer) ? cleanCustomer(customer, 'Razorpay Online') : null,
        subtotal: pricing.subtotalPaise / 100,
        shipping: pricing.shippingFeePaise / 100,
        total: pricing.totalPaise / 100,
        currency: pricing.currency,
        createdAt: FieldValue.serverTimestamp()
    });
};

// `fallback` is what the browser sent at verification time - only used for parts
// the pending checkout doesn't have (checkouts started before it was recorded).
export const finalizeShopPayment = async ({ razorpayOrder, paymentId, via, payment = null, fallback = {} }) => {
    const db = adminDb();
    const orderRef = db.collection('orders').doc(paymentId); // deterministic id => idempotent
    const pendingRef = db.collection('pending_payments').doc(razorpayOrder.id);

    return db.runTransaction(async (tx) => {
        const [existing, pendingSnap] = await tx.getAll(orderRef, pendingRef);
        if (existing.exists) {
            return { order: { id: existing.id, ...serializeTimestamps(existing.data()) }, alreadyProcessed: true };
        }
        const pending = pendingSnap.exists ? pendingSnap.data() : {};

        let items = Array.isArray(pending.items) && pending.items.length ? pending.items : null;
        let subtotal = pending.subtotal ?? null;
        let shipping = pending.shipping ?? null;
        if (!items) {
            try {
                const pricing = computeCartTotal(fallback.cartLines, razorpayOrder.currency === 'INR');
                items = toDisplayItems(pricing);
                subtotal = pricing.subtotalPaise / 100;
                shipping = pricing.shippingFeePaise / 100;
            } catch (err) {
                items = cleanClientItems(fallback.items);
            }
        }

        const customerSource = hasCustomer(pending.customer) ? pending.customer : fallback.customer;
        const order = {
            orderNumber: str(razorpayOrder.receipt, 60) || str(pending.orderNumber, 60) || paymentId,
            customer: cleanCustomer(customerSource || {}, 'Razorpay Online', payment),
            items,
            subtotal,
            shipping,
            // What Razorpay actually charged, not a recomputation.
            total: razorpayOrder.amount / 100,
            currency: razorpayOrder.currency,
            paymentId,
            razorpayOrderId: razorpayOrder.id,
            paymentStatus: 'Paid & Verified',
            status: 'Order Placed',
            recordedVia: via,
            date: istDate(),
            createdAt: FieldValue.serverTimestamp()
        };
        // Paid, but the address or cart couldn't be recovered - flagged so the admin can
        // match it against the Razorpay dashboard and contact the customer.
        if (!hasCustomer(customerSource) || !items.length) order.needsReview = true;

        tx.set(orderRef, order);
        tx.set(pendingRef, { status: 'paid', paymentId, paidAt: FieldValue.serverTimestamp(), completedVia: via }, { merge: true });
        return { order: { id: paymentId, ...order, createdAt: Date.now() }, alreadyProcessed: false };
    });
};

export const saveCodOrder = async ({ orderNumber, customer, pricing }) => {
    const order = {
        orderNumber: str(orderNumber, 60) || `AYD-${Date.now()}`,
        customer: cleanCustomer(customer, 'Cash on Delivery'),
        items: toDisplayItems(pricing),
        subtotal: pricing.subtotalPaise / 100,
        shipping: pricing.shippingFeePaise / 100,
        total: pricing.totalPaise / 100,
        currency: pricing.currency,
        paymentId: 'COD',
        paymentStatus: 'Pending COD',
        status: 'Order Placed',
        recordedVia: 'checkout',
        date: istDate(),
        createdAt: FieldValue.serverTimestamp()
    };
    const ref = adminDb().collection('orders').doc();
    await ref.set(order);
    return { id: ref.id, ...order, createdAt: Date.now() };
};
