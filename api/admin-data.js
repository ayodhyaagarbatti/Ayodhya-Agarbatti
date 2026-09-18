import readJsonBody from './_readJsonBody.js';
import { verifySession } from './_adminSession.js';
import { adminDb, FieldValue } from './_firebaseAdmin.js';

const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
};

// Combined read+write path for the admin dashboard's data (orders, contact_messages,
// subscribers, reviews, activity_logs, redemption_requests all contain customer PII
// or are otherwise not meant to be readable by anyone with the public web API key, so
// Firestore rules deny them to the client SDK entirely). Gated by the same admin
// session token used across api/admin-*.js, verified before adminDb() (which bypasses
// Firestore rules) is touched. Combined into one function (rather than separate
// admin-list.js/admin-mutate.js) to stay under Vercel's serverless function count limit.
const COLLECTIONS = {
    orders: { orderBy: 'createdAt', limit: 500 },
    activity_logs: { orderBy: 'createdAt', limit: 200 },
    contact_messages: { orderBy: 'createdAt', limit: 500 },
    subscribers: { orderBy: 'createdAt', limit: 1000 },
    reviews: { orderBy: 'createdAt', limit: 500 },
    redemption_requests: { orderBy: 'createdAt', limit: 500 }
};

const ORDER_STATUSES = ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const serializeTimestamps = (data) => {
    const out = { ...data };
    for (const key of Object.keys(out)) {
        if (out[key]?.toMillis) out[key] = out[key].toMillis();
    }
    return out;
};

const handleList = async (db, body, res) => {
    const config = COLLECTIONS[body.collection];
    if (!config) {
        sendJson(res, 400, { error: 'Unknown collection.' });
        return;
    }
    const snap = await db.collection(body.collection).orderBy(config.orderBy, 'desc').limit(config.limit).get();
    const items = snap.docs.map((doc) => ({ id: doc.id, ...serializeTimestamps(doc.data()) }));
    sendJson(res, 200, { items });
};

const handleMutate = async (db, body, res) => {
    switch (body.action) {
        case 'update-order-status': {
            if (!ORDER_STATUSES.includes(body.status)) throw new Error('Invalid order status.');
            await db.collection('orders').doc(body.orderId).set(
                { status: body.status, updatedAt: FieldValue.serverTimestamp() },
                { merge: true }
            );
            break;
        }
        case 'delete-order':
            await db.collection('orders').doc(body.orderId).delete();
            break;
        case 'create-test-order': {
            const testOrderNumber = `AYD-${Date.now().toString().slice(-6)}-TEST`;
            const docRef = await db.collection('orders').add({
                orderNumber: testOrderNumber,
                customer: {
                    name: 'Ayodhya Test Buyer',
                    email: 'test.buyer@ayodhyaagarbatti.in',
                    phone: '+91 98765 00000',
                    address: 'Temple View, Ayodhya - 224123',
                    paymentMethod: 'Razorpay Online'
                },
                items: [{ id: 1, name: 'Espresso Ground Incense', variant: 'Coffee & Cocoa', price: '₹70', quantity: 2 }],
                subtotal: 598,
                shipping: 0,
                total: 598,
                paymentStatus: 'Paid',
                status: 'Order Placed',
                date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                createdAt: FieldValue.serverTimestamp()
            });
            sendJson(res, 200, { success: true, id: docRef.id });
            return;
        }
        case 'delete-log':
            await db.collection('activity_logs').doc(body.logId).delete();
            break;
        case 'toggle-message-read': {
            const ref = db.collection('contact_messages').doc(body.messageId);
            const snap = await ref.get();
            const current = snap.data()?.status;
            await ref.set({ status: current === 'read' ? 'unread' : 'read' }, { merge: true });
            break;
        }
        case 'delete-message':
            await db.collection('contact_messages').doc(body.messageId).delete();
            break;
        case 'delete-subscriber':
            await db.collection('subscribers').doc(body.subId).delete();
            break;
        case 'delete-review':
            await db.collection('reviews').doc(body.reviewId).delete();
            break;
        default:
            throw new Error('Unknown action.');
    }
    sendJson(res, 200, { success: true });
};

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

    if (!verifySession(body.token, process.env.ADMIN_SESSION_SECRET)) {
        sendJson(res, 401, { error: 'Invalid or expired admin session.' });
        return;
    }

    const db = adminDb();

    try {
        if (body.mode === 'mutate') {
            await handleMutate(db, body, res);
        } else {
            await handleList(db, body, res);
        }
    } catch (err) {
        sendJson(res, body.mode === 'mutate' ? 400 : 500, { error: err.message || 'Request failed.' });
    }
}
