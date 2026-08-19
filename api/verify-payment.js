import crypto from 'crypto';
import readJsonBody from './_readJsonBody.js';

const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
};

// Constant-time compare so a mismatched signature can't be timed to leak information.
const signaturesMatch = (expectedHex, actualHex) => {
    const expected = Buffer.from(expectedHex, 'hex');
    const actual = Buffer.from(actualHex, 'hex');
    if (expected.length !== actual.length) return false;
    return crypto.timingSafeEqual(expected, actual);
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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        sendJson(res, 400, { error: 'Missing razorpay_order_id, razorpay_payment_id or razorpay_signature.' });
        return;
    }

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    let verified = false;
    try {
        verified = signaturesMatch(expectedSignature, razorpay_signature);
    } catch (err) {
        // razorpay_signature wasn't valid hex, or lengths differ - treat as unverified.
        verified = false;
    }

    if (!verified) {
        sendJson(res, 400, { verified: false, error: 'Signature verification failed.' });
        return;
    }

    sendJson(res, 200, { verified: true });
}
