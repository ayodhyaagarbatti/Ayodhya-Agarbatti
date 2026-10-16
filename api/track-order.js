import readJsonBody from './_readJsonBody.js';
import { adminDb } from './_firebaseAdmin.js';

const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
};

const lastTenDigits = (value) => String(value || '').replace(/\D/g, '').slice(-10);

// Public order lookup for customers. `orders` is closed to the client SDK, so this
// reads it with the Admin SDK - but only returns an order when both the order number
// and the phone number used at checkout match, and never returns the full address,
// email or phone.
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed' });
        return;
    }

    let body;
    try {
        body = await readJsonBody(req);
    } catch (err) {
        sendJson(res, 400, { error: 'Invalid JSON body' });
        return;
    }

    const orderNumber = String(body.orderNumber || '').trim().toUpperCase().replace(/^#/, '');
    const phone = lastTenDigits(body.phone);
    if (!orderNumber || phone.length < 10) {
        sendJson(res, 400, { error: 'Enter your order number and the 10-digit phone number used at checkout.' });
        return;
    }

    try {
        const snap = await adminDb().collection('orders').where('orderNumber', '==', orderNumber).limit(5).get();
        const doc = snap.docs.find((d) => lastTenDigits(d.data().customer?.phone) === phone);
        if (!doc) {
            sendJson(res, 404, { error: 'No order found with that order number and phone number.' });
            return;
        }

        const o = doc.data();
        sendJson(res, 200, {
            order: {
                orderNumber: o.orderNumber,
                status: o.status || 'Order Placed',
                date: o.date || '',
                createdAt: o.createdAt?.toMillis?.() || null,
                updatedAt: o.updatedAt?.toMillis?.() || null,
                customerName: o.customer?.firstName || o.customer?.name || '',
                city: o.customer?.city || '',
                pincode: o.customer?.pincode || '',
                paymentMethod: o.customer?.paymentMethod || 'Online',
                paymentStatus: o.paymentStatus || '',
                items: (o.items || []).map((item) => ({
                    name: item.name || '',
                    variant: item.variant || '',
                    price: item.price || '',
                    quantity: item.quantity || 1
                })),
                subtotal: o.subtotal,
                shipping: o.shipping,
                total: o.total,
                currency: o.currency || 'INR'
            }
        });
    } catch (err) {
        sendJson(res, 500, { error: 'Could not look up the order right now. Please try again shortly.' });
    }
}
