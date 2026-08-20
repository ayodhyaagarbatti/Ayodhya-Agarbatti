import razorpay from './_razorpay.js';
import readJsonBody from './_readJsonBody.js';
import { computeHoroscopePrice } from './_horoscopePricing.js';
import { adminDb } from './_firebaseAdmin.js';

const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
};

// Looks up which signed-in user owns a referral code, so their uid can ride
// along on the Razorpay order (via `notes`) and be credited once payment is
// verified. Never blocks checkout - if Firebase Admin isn't configured yet, or
// the code doesn't resolve, the purchase just proceeds without a referral.
const resolveReferrer = async (referralCode, customerEmail) => {
    if (!referralCode) return null;
    try {
        const snap = await adminDb()
            .collection('users')
            .where('referralCode', '==', String(referralCode).trim().toUpperCase())
            .limit(1)
            .get();
        if (snap.empty) return null;

        const referrerDoc = snap.docs[0];
        const referrerEmail = (referrerDoc.data().email || '').toLowerCase();
        const buyerEmail = (customerEmail || '').toLowerCase();
        if (buyerEmail && referrerEmail === buyerEmail) return null; // no self-referral

        return referrerDoc.id;
    } catch (err) {
        console.warn('Referral lookup skipped:', err.message);
        return null;
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

    const { productId, couponCode, referralCode, customerEmail } = body;
    const receipt = body.receipt || `receipt_${Date.now()}`;

    let pricing;
    try {
        pricing = computeHoroscopePrice(productId, couponCode);
    } catch (err) {
        sendJson(res, 400, { error: err.message });
        return;
    }

    const referrerUid = await resolveReferrer(referralCode, customerEmail);

    // Notes ride along on the Razorpay order and are read back at verification
    // time, so the verify step never has to trust anything the client claims
    // about coupon/referral state - it's all already fixed at order-creation time.
    const notes = { productId: String(productId) };
    if (referrerUid) notes.referrerUid = referrerUid;
    if (pricing.couponApplied) notes.couponApplied = 'true';

    try {
        const order = await razorpay.orders.create({
            amount: pricing.amountPaise,
            currency: 'INR',
            receipt,
            notes
        });
        sendJson(res, 200, {
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            couponApplied: pricing.couponApplied,
            referralApplied: Boolean(referrerUid)
        });
    } catch (err) {
        const isAuthError = err.statusCode === 401;
        sendJson(res, isAuthError ? 401 : 500, {
            error: err.error?.description || err.message || 'Failed to create order'
        });
    }
}
