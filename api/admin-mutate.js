import readJsonBody from './_readJsonBody.js';
import { verifySession } from './_adminSession.js';
import { adminDb, FieldValue } from './_firebaseAdmin.js';

const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
};

const ORDER_STATUSES = ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

// The admin dashboard's write path for collections Firestore rules deny to the client
// SDK. Every action here is gated by the same admin session token used across
// api/admin-*.js, verified before adminDb() (which bypasses Firestore rules) is touched.
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
    } catch (err) {
        sendJson(res, 400, { error: err.message || 'Action failed.' });
    }
}
