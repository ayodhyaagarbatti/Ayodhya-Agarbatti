import readJsonBody from './_readJsonBody.js';
import { verifySession } from './_adminSession.js';
import { adminDb } from './_firebaseAdmin.js';

const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
};

// The admin dashboard's read path for collections that Firestore rules deny to the
// client SDK entirely (orders, contact_messages, subscribers, reviews, activity_logs,
// redemption_requests all contain customer PII or are otherwise not meant to be
// listable by anyone with the public web API key). This is the only way Admin.jsx can
// see them now - gated by the same admin session token used by admin-resolve-redemption.js,
// verified server-side before adminDb() (which bypasses Firestore rules) is touched.
const COLLECTIONS = {
    orders: { orderBy: 'createdAt', limit: 500 },
    activity_logs: { orderBy: 'createdAt', limit: 200 },
    contact_messages: { orderBy: 'createdAt', limit: 500 },
    subscribers: { orderBy: 'createdAt', limit: 1000 },
    reviews: { orderBy: 'createdAt', limit: 500 },
    redemption_requests: { orderBy: 'createdAt', limit: 500 }
};

const serializeTimestamps = (data) => {
    const out = { ...data };
    for (const key of Object.keys(out)) {
        if (out[key]?.toMillis) out[key] = out[key].toMillis();
    }
    return out;
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

    const config = COLLECTIONS[body.collection];
    if (!config) {
        sendJson(res, 400, { error: 'Unknown collection.' });
        return;
    }

    try {
        const db = adminDb();
        const snap = await db.collection(body.collection).orderBy(config.orderBy, 'desc').limit(config.limit).get();
        const items = snap.docs.map((doc) => ({ id: doc.id, ...serializeTimestamps(doc.data()) }));
        sendJson(res, 200, { items });
    } catch (err) {
        sendJson(res, 500, { error: err.message || 'Failed to load data.' });
    }
}
