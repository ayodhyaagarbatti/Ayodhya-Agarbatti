import readJsonBody from './_readJsonBody.js';
import { computeHoroscopePrice } from './_horoscopePricing.js';

const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
};

// Pure price lookup, no Razorpay order is created here - lets the coupon field
// show the real (server-computed) price before the user commits to paying.
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

    try {
        const pricing = computeHoroscopePrice(body.productId, body.couponCode);
        sendJson(res, 200, {
            amountRupees: pricing.amountPaise / 100,
            couponApplied: pricing.couponApplied
        });
    } catch (err) {
        sendJson(res, 400, { error: err.message });
    }
}
