import readJsonBody from './_readJsonBody.js';
import { adminDb, FieldValue } from './_firebaseAdmin.js';
import { verifyIdTokenFromRequest } from './_verifyIdToken.js';

const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
};

// Every public-facing write/read the site needs for collections Firestore rules close
// to the client SDK (orders, activity_logs, subscribers, reviews, contact_messages,
// users). Combined into one function, keyed by `action`, to stay under Vercel's
// serverless function count limit. Each action validates and trims its own input,
// and timestamps are always set server-side.
const str = (value, max = 300) => (value == null ? '' : String(value).slice(0, max).trim());
const lastTenDigits = (value) => String(value || '').replace(/\D/g, '').slice(-10);
const istDate = (withTime) => new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {})
});
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// Keeps an arbitrary JSON value small and Firestore-safe (no undefined, bounded depth/size).
const cleanDetails = (value, depth = 0) => {
    if (value == null) return null;
    if (typeof value === 'string') return value.slice(0, 500);
    if (typeof value === 'number' || typeof value === 'boolean') return value;
    if (depth > 3) return null;
    if (Array.isArray(value)) return value.slice(0, 30).map((v) => cleanDetails(v, depth + 1));
    if (typeof value === 'object') {
        const out = {};
        for (const key of Object.keys(value).slice(0, 30)) out[key.slice(0, 60)] = cleanDetails(value[key], depth + 1);
        return out;
    }
    return null;
};

const ACTIVITY_TYPES = ['PAGE_VIEW', 'CART_ACTION', 'CHECKOUT_STEP', 'USER_AUTH', 'SEARCH'];

const actions = {
    // Customer order lookup: only returns an order when both the order number and the
    // checkout phone number match, and never returns the full address, email or phone.
    'track-order': async (db, body) => {
        const orderNumber = str(body.orderNumber, 60).toUpperCase().replace(/^#/, '');
        const phone = lastTenDigits(body.phone);
        if (!orderNumber || phone.length < 10) {
            return [400, { error: 'Enter your order number and the 10-digit phone number used at checkout.' }];
        }
        const snap = await db.collection('orders').where('orderNumber', '==', orderNumber).limit(5).get();
        const doc = snap.docs.find((d) => lastTenDigits(d.data().customer?.phone) === phone);
        if (!doc) return [404, { error: 'No order found with that order number and phone number.' }];

        const o = doc.data();
        return [200, {
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
        }];
    },

    'log-activity': async (db, body) => {
        const type = str(body.type, 30);
        if (!ACTIVITY_TYPES.includes(type)) return [400, { error: 'Unknown activity type.' }];
        await db.collection('activity_logs').add({
            type,
            sessionId: str(body.sessionId, 60),
            device: str(body.device, 30),
            browser: str(body.browser, 30),
            screenSize: str(body.screenSize, 30),
            timestamp: str(body.timestamp, 60) || istDate(true),
            details: cleanDetails(body.details) || {},
            createdAt: FieldValue.serverTimestamp()
        });
        return [200, { success: true }];
    },

    subscribe: async (db, body) => {
        const email = str(body.email, 200).toLowerCase();
        if (!isEmail(email)) return [400, { error: 'Please enter a valid email address.' }];
        // Doc id = email, so subscribing twice doesn't create duplicates.
        await db.collection('subscribers').doc(email).set({
            email,
            subscribedAt: istDate(false),
            createdAt: FieldValue.serverTimestamp()
        }, { merge: true });
        return [200, { success: true }];
    },

    'submit-review': async (db, body) => {
        const name = str(body.name, 80);
        const comment = str(body.comment, 2000);
        const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 5)));
        if (!name || !comment) return [400, { error: 'Please add your name and a comment.' }];
        const review = {
            productId: Number(body.productId) || null,
            productSlug: str(body.productSlug, 120),
            productName: str(body.productName, 200),
            name,
            location: 'Verified Purchaser',
            rating,
            date: istDate(false),
            comment,
            createdAt: FieldValue.serverTimestamp()
        };
        const ref = await db.collection('reviews').add(review);
        return [200, { success: true, review: { id: ref.id, ...review, createdAt: Date.now() } }];
    },

    'list-reviews': async (db, body) => {
        const productId = Number(body.productId);
        if (!Number.isFinite(productId)) return [400, { error: 'Missing productId.' }];
        const snap = await db.collection('reviews').where('productId', '==', productId).limit(100).get();
        const reviews = snap.docs.map((d) => {
            const r = d.data();
            return { id: d.id, name: r.name, location: r.location, rating: r.rating, date: r.date, comment: r.comment, createdAt: r.createdAt?.toMillis?.() || 0 };
        }).sort((a, b) => b.createdAt - a.createdAt);
        return [200, { reviews }];
    },

    contact: async (db, body) => {
        const firstName = str(body.firstName, 80);
        const lastName = str(body.lastName, 80);
        const email = str(body.email, 200);
        const message = str(body.message, 5000);
        if (!firstName || !isEmail(email) || !message) {
            return [400, { error: 'Please fill in your name, a valid email and a message.' }];
        }
        await db.collection('contact_messages').add({
            firstName,
            lastName,
            name: `${firstName} ${lastName}`.trim(),
            email,
            subject: str(body.subject, 120) || 'General Inquiry',
            message,
            status: 'unread',
            date: istDate(true),
            createdAt: FieldValue.serverTimestamp()
        });
        return [200, { success: true }];
    },

    // Profile fields come from the verified Firebase ID token, not the request body,
    // so a visitor can only ever write their own profile, with their real sign-in data.
    'sync-profile': async (db, body, req) => {
        const decoded = await verifyIdTokenFromRequest(req);
        if (!decoded) return [401, { error: 'Sign in required.' }];
        const ref = db.collection('users').doc(decoded.uid);
        const existing = await ref.get();
        await ref.set({
            name: decoded.name || existing.data()?.name || '',
            email: decoded.email || '',
            photoURL: decoded.picture || '',
            emailVerified: !!decoded.email_verified,
            provider: decoded.firebase?.sign_in_provider === 'google.com' ? 'google' : 'password',
            lastLoginAt: FieldValue.serverTimestamp(),
            ...(existing.exists && existing.data()?.createdAt ? {} : { createdAt: FieldValue.serverTimestamp() })
        }, { merge: true });
        return [200, { success: true }];
    }
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

    const action = actions[body.action];
    if (!action) {
        sendJson(res, 400, { error: 'Unknown action.' });
        return;
    }

    try {
        const [status, payload] = await action(adminDb(), body, req);
        sendJson(res, status, payload);
    } catch (err) {
        sendJson(res, 500, { error: 'Request failed. Please try again shortly.' });
    }
}
