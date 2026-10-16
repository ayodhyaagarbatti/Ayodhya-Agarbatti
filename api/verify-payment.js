import crypto from 'crypto';
import readJsonBody from './_readJsonBody.js';
import razorpay from './_razorpay.js';
import { finalizeShopPayment } from './_shopOrders.js';
import { handleRazorpayWebhook } from './_razorpayWebhook.js';

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

// Razorpay's own headers - present on its server-to-server webhook calls, never on
// the checkout's verification request.
const isRazorpayWebhook = (req) => req.headers['x-razorpay-signature'] !== undefined || req.headers['x-razorpay-event-id'] !== undefined;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed' });
        return;
    }

    // The Razorpay webhook shares this function to stay under Vercel's function-count
    // limit. It's routed before the body is read, because it needs the raw body to
    // check Razorpay's signature.
    if (isRazorpayWebhook(req)) {
        await handleRazorpayWebhook(req, res);
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

    // Signature is valid, so the payment is real - record the order from the checkout
    // saved before payment (create-shop-order.js), falling back to what the browser
    // sends now. The total is read back from Razorpay itself. If the webhook already
    // recorded it, this just returns that order.
    try {
        const rzpOrder = await razorpay.orders.fetch(razorpay_order_id);
        const { order, alreadyProcessed } = await finalizeShopPayment({
            razorpayOrder: rzpOrder,
            paymentId: razorpay_payment_id,
            via: 'checkout',
            fallback: { customer: body.customer, cartLines: body.cartItems, items: body.items }
        });
        sendJson(res, 200, { verified: true, order, alreadyProcessed });
    } catch (err) {
        console.error('Error recording shop order:', err);
        sendJson(res, 200, { verified: true, saveError: err.message || 'Failed to save order' });
    }
}
