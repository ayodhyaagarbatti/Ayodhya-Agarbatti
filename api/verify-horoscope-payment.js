import crypto from 'crypto';
import readJsonBody from './_readJsonBody.js';
import razorpay from './_razorpay.js';
import { recordHoroscopePayment } from './_horoscopeOrders.js';

const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
};

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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber, customer, subject, partner, date, referralCode } = body;
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
        verified = false;
    }

    if (!verified) {
        sendJson(res, 400, { verified: false, error: 'Signature verification failed.' });
        return;
    }

    // What was actually charged (amount, coupon, referrer) is read back from Razorpay's
    // own record of the order inside recordHoroscopePayment - see _horoscopeOrders.js.
    let order;
    try {
        order = await razorpay.orders.fetch(razorpay_order_id);
    } catch (err) {
        sendJson(res, 500, { verified: true, error: 'Payment verified but could not read order details: ' + err.message });
        return;
    }

    // Idempotent with the Razorpay webhook: whichever records the payment first wins,
    // and the referral commission is only ever credited once.
    let result;
    try {
        result = await recordHoroscopePayment({
            razorpayOrder: order,
            paymentId: razorpay_payment_id,
            via: 'checkout',
            details: { orderNumber, productId: body.productId, couponCode: body.couponCode, referralCode, customer, subject, partner, date }
        });
    } catch (err) {
        console.error('Error persisting horoscope order:', err);
        sendJson(res, 500, {
            verified: true,
            error: 'Payment verified but failed to record your order. Please contact support with payment ID: ' + razorpay_payment_id
        });
        return;
    }

    sendJson(res, 200, {
        verified: true,
        alreadyProcessed: result.alreadyProcessed,
        orderId: result.orderId,
        commissionCredited: result.commissionCredited && !result.alreadyProcessed
    });
}
