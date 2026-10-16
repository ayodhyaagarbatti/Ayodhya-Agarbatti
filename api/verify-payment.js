import crypto from 'crypto';
import readJsonBody from './_readJsonBody.js';
import razorpay from './_razorpay.js';
import { computeCartTotal } from './_shopPricing.js';
import { saveShopOrder } from './_saveShopOrder.js';

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

    // Signature is valid, so the payment is real - save the order server-side (client
    // writes to `orders` are denied by Firestore rules). The total charged is read back
    // from Razorpay itself; the doc id is the payment id, so a retried call can't
    // create a duplicate order.
    if (!body.customer || !Array.isArray(body.cartItems)) {
        sendJson(res, 200, { verified: true });
        return;
    }
    try {
        const rzpOrder = await razorpay.orders.fetch(razorpay_order_id);
        const pricing = computeCartTotal(body.cartItems, rzpOrder.currency === 'INR');
        const saved = await saveShopOrder({
            docId: razorpay_payment_id,
            orderNumber: rzpOrder.receipt,
            customer: body.customer,
            items: body.items,
            paymentMethod: 'Razorpay Online',
            paymentId: razorpay_payment_id,
            paymentStatus: 'Paid & Verified',
            subtotal: pricing.subtotalPaise / 100,
            shipping: pricing.shippingFeePaise / 100,
            total: rzpOrder.amount / 100,
            currency: rzpOrder.currency
        });
        sendJson(res, 200, { verified: true, order: saved });
    } catch (err) {
        sendJson(res, 200, { verified: true, saveError: err.message || 'Failed to save order' });
    }
}
