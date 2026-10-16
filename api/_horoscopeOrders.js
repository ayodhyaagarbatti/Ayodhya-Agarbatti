import { adminDb, FieldValue } from './_firebaseAdmin.js';
import { horoscopeProducts } from '../src/data/horoscopeProducts.js';

// Horoscope orders follow the same two-step pattern as shop orders (see _shopOrders.js):
// create-horoscope-order.js saves the checkout to pending_payments/{razorpayOrderId}
// before payment, and recordHoroscopePayment() records the paid order - from the
// customer's browser (verify-horoscope-payment.js) or Razorpay's webhook
// (_razorpayWebhook.js), whichever arrives first. It's idempotent on the payment id,
// so the referral commission can only ever be credited once.
const str = (value, max = 300) => (value == null ? '' : String(value).slice(0, max).trim());

const istDate = () => new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
});

const firstFilled = (...values) => values.find((v) => v !== undefined && v !== null && v !== '') ?? null;

// Birth details as entered in HoroscopeDetailsForm.jsx - copied field by field,
// keeping numbers as numbers and bounding every string.
const PERSON_FIELDS = ['name', 'dob', 'tob', 'timeUnknown', 'gender', 'place', 'lat', 'lon', 'tz'];
const cleanPerson = (person) => {
    if (!person || typeof person !== 'object') return null;
    const out = {};
    for (const key of PERSON_FIELDS) {
        const value = person[key];
        if (typeof value === 'number' || typeof value === 'boolean') out[key] = value;
        else out[key] = str(value, key === 'place' ? 200 : 100);
    }
    return out.name || out.dob ? out : null;
};

const cleanContact = (contact) => {
    if (!contact || typeof contact !== 'object') return null;
    const out = { name: str(contact.name, 100), email: str(contact.email, 200), phone: str(contact.phone, 30) };
    return out.name || out.email || out.phone ? out : null;
};

export const savePendingHoroscopeCheckout = async ({ razorpayOrder, orderNumber, productId, customer, subject, partner, couponCode, referralCode }) => {
    await adminDb().collection('pending_payments').doc(razorpayOrder.id).set({
        kind: 'horoscope',
        status: 'created',
        orderNumber: str(orderNumber, 60),
        razorpayOrderId: razorpayOrder.id,
        productId: str(productId, 60),
        amount: razorpayOrder.amount / 100,
        currency: razorpayOrder.currency,
        customer: cleanContact(customer),
        subject: cleanPerson(subject),
        partner: cleanPerson(partner),
        couponCode: couponCode ? str(couponCode, 40) : null,
        referralCode: referralCode ? str(referralCode, 40) : null,
        createdAt: FieldValue.serverTimestamp()
    });
};

// `details` is what the browser sent at verification time (empty for the webhook);
// the pending checkout saved before payment takes precedence. `payment` is
// Razorpay's payment entity when known, used to fill a missing email/phone.
export const recordHoroscopePayment = async ({ razorpayOrder, paymentId, via, details = {}, payment = null }) => {
    // Everything about what was actually charged (amount, coupon, referrer) comes
    // from Razorpay's own record of the order, not from anything the client says
    // now - the order's `notes` were fixed at creation time in create-horoscope-order.js.
    const notes = razorpayOrder.notes || {};
    // The wallet/commission system is entirely INR-denominated (payouts go out via
    // UPI/bank transfer in India) - crediting 10% of a USD order as if it were paise
    // would under-credit the referrer by the full INR/USD exchange rate. International
    // orders just don't generate a commission for now.
    const referrerUid = razorpayOrder.currency === 'INR' ? (notes.referrerUid || null) : null;
    const couponApplied = notes.couponApplied === 'true';
    const amountRupees = razorpayOrder.amount / 100;

    const db = adminDb();
    const orderRef = db.collection('horoscope_orders').doc(paymentId); // deterministic id => idempotent
    const pendingRef = db.collection('pending_payments').doc(razorpayOrder.id);
    const userRef = referrerUid ? db.collection('users').doc(referrerUid) : null;

    return db.runTransaction(async (tx) => {
        const [existing, pendingSnap] = await tx.getAll(orderRef, pendingRef);
        if (existing.exists) {
            return { orderId: orderRef.id, alreadyProcessed: true, commissionCredited: false };
        }
        const pending = pendingSnap.exists ? pendingSnap.data() : {};

        const productId = firstFilled(notes.productId, pending.productId, str(details.productId, 60));
        const product = horoscopeProducts.find((p) => p.id === productId);
        const orderNumber = firstFilled(pending.orderNumber, str(details.orderNumber, 60), paymentId);
        const subject = cleanPerson(pending.subject) || cleanPerson(details.subject);
        const customer = cleanContact(pending.customer) || cleanContact(details.customer) || { name: '', email: '', phone: '' };
        if (!customer.name && subject?.name) customer.name = subject.name;
        if (!customer.email) customer.email = str(payment?.email, 200);
        if (!customer.phone) customer.phone = str(payment?.contact, 30);
        const commissionPaise = referrerUid ? Math.round(amountRupees * 100 * 0.10) : 0;

        tx.set(orderRef, {
            orderNumber,
            productId,
            productName: product?.name || 'Vedic Horoscope Reading',
            amount: amountRupees,
            currency: razorpayOrder.currency,
            couponCode: couponApplied ? firstFilled(pending.couponCode, str(details.couponCode, 40)) : null,
            couponApplied,
            referralCodeUsed: referrerUid ? firstFilled(pending.referralCode, str(details.referralCode, 40)) : null,
            referrerUid,
            commissionPaise,
            commissionCredited: Boolean(referrerUid),
            razorpayOrderId: razorpayOrder.id,
            paymentId,
            paymentStatus: 'Paid & Verified',
            customer,
            subject,
            partner: cleanPerson(pending.partner) || cleanPerson(details.partner),
            recordedVia: via,
            date: firstFilled(str(details.date, 40), istDate()),
            createdAt: FieldValue.serverTimestamp()
        });

        if (referrerUid && commissionPaise > 0) {
            const ledgerRef = db.collection('wallet_ledger').doc();
            tx.set(ledgerRef, {
                uid: referrerUid,
                type: 'commission',
                amountPaise: commissionPaise,
                relatedOrderId: orderRef.id,
                relatedRedemptionId: null,
                createdAt: FieldValue.serverTimestamp(),
                note: `10% referral commission for order ${orderNumber}`
            });
            tx.set(userRef, { walletBalance: FieldValue.increment(commissionPaise) }, { merge: true });
        }

        tx.set(pendingRef, { status: 'paid', paymentId, paidAt: FieldValue.serverTimestamp(), completedVia: via }, { merge: true });
        return { orderId: orderRef.id, alreadyProcessed: false, commissionCredited: Boolean(referrerUid) };
    });
};
