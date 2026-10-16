import { adminDb, FieldValue } from './_firebaseAdmin.js';

// Firestore rules deny client writes to `orders` (it holds customer PII and is only
// readable through api/admin-data.js), so every shop order is written here with the
// Admin SDK. Totals always come from the server's own pricing, never the browser.
const str = (value, max = 300) => (value == null ? '' : String(value).slice(0, max));

const cleanCustomer = (customer = {}, paymentMethod) => {
    const firstName = str(customer.firstName, 100);
    const lastName = str(customer.lastName, 100);
    const street = str(customer.street, 500);
    const city = str(customer.city, 100);
    const pincode = str(customer.pincode, 20);
    return {
        name: `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        address: `${street}, ${city} - ${pincode}`,
        street,
        city,
        pincode,
        phone: str(customer.phone, 30),
        email: str(customer.email, 200),
        paymentMethod
    };
};

const cleanItems = (items) => (Array.isArray(items) ? items.slice(0, 100) : []).map((item) => ({
    id: item.id ?? null,
    name: str(item.name, 200),
    variant: str(item.variant, 200),
    price: str(item.price, 50),
    quantity: Math.max(1, Number(item.quantity) || 1),
    image: str(item.image, 500)
}));

export const saveShopOrder = async ({ docId, orderNumber, customer, items, paymentMethod, paymentId, paymentStatus, subtotal, shipping, total, currency }) => {
    const order = {
        orderNumber: str(orderNumber, 60) || `AYD-${Date.now()}`,
        customer: cleanCustomer(customer, paymentMethod),
        items: cleanItems(items),
        subtotal,
        shipping,
        total,
        currency,
        paymentId,
        paymentStatus,
        status: 'Order Placed',
        date: new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        createdAt: FieldValue.serverTimestamp()
    };
    const collection = adminDb().collection('orders');
    const ref = docId ? collection.doc(docId) : collection.doc();
    await ref.set(order);
    return { id: ref.id, ...order, createdAt: Date.now() };
};
