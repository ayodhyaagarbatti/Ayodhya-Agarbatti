import razorpay from './_razorpay.js';
import readJsonBody from './_readJsonBody.js';

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

    const amount = Number(body.amount);
    const currency = body.currency || 'INR';
    const receipt = body.receipt || `receipt_${Date.now()}`;

    if (!Number.isFinite(amount) || amount < 100) {
        sendJson(res, 400, { error: 'Amount must be at least 100 paise (₹1).' });
        return;
    }

    try {
        const order = await razorpay.orders.create({ amount, currency, receipt });
        sendJson(res, 200, { order_id: order.id, amount: order.amount, currency: order.currency });
    } catch (err) {
        const isAuthError = err.statusCode === 401;
        sendJson(res, isAuthError ? 401 : 500, {
            error: err.error?.description || err.message || 'Failed to create order'
        });
    }
}
