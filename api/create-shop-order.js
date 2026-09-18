import razorpay from './_razorpay.js';
import readJsonBody from './_readJsonBody.js';
import { computeCartTotal } from './_shopPricing.js';
import { isIndiaRequest } from './_region.js';

const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
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

    const receipt = body.receipt || `receipt_${Date.now()}`;

    const isIndia = isIndiaRequest(req);

    let pricing;
    try {
        pricing = computeCartTotal(body.cartItems, isIndia);
    } catch (err) {
        sendJson(res, 400, { error: err.message });
        return;
    }

    try {
        const order = await razorpay.orders.create({
            amount: pricing.totalPaise,
            currency: pricing.currency,
            receipt
        });
        sendJson(res, 200, {
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            subtotal: pricing.subtotalPaise / 100,
            shippingFee: pricing.shippingFeePaise / 100,
            total: pricing.totalPaise / 100
        });
    } catch (err) {
        const isAuthError = err.statusCode === 401;
        sendJson(res, isAuthError ? 401 : 500, {
            error: err.error?.description || err.message || 'Failed to create order'
        });
    }
}
