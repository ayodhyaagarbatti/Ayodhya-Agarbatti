import crypto from 'crypto';
import razorpay from './_razorpay.js';
import { adminDb } from './_firebaseAdmin.js';
import { finalizeShopPayment } from './_shopOrders.js';
import { recordHoroscopePayment } from './_horoscopeOrders.js';

// Razorpay -> server webhook (Dashboard > Webhooks, event `order.paid`), served from
// api/verify-payment.js. It records a paid order even when the customer's browser
// never reports back (tab closed, phone locked, network dropped right after paying).
//
// The payload is never trusted on its own. If its HMAC signature verifies against
// RAZORPAY_WEBHOOK_SECRET it's used as-is; otherwise the payment and order are
// re-read from Razorpay's API with our own keys, and only checkouts this site
// created itself (pending_payments) are acted on - so a forged request can at
// worst record a real, captured payment that should have been recorded anyway.
const HANDLED_EVENTS = ['order.paid', 'payment.captured'];

const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
};

// The signature covers the exact bytes Razorpay sent, so this needs the raw body.
// That's only possible while the request stream is still unread - if the runtime
// already consumed it to build req.body, raw comes back null.
const readRawBody = (req) => new Promise((resolve) => {
    const fallback = () => ({ raw: null, body: req.body ?? null });
    if (req.readableEnded) {
        resolve(fallback());
        return;
    }
    const chunks = [];
    const timer = setTimeout(() => resolve(fallback()), 4000);
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => {
        clearTimeout(timer);
        const raw = Buffer.concat(chunks).toString('utf8');
        let body = null;
        try {
            body = raw ? JSON.parse(raw) : {};
        } catch (err) {
            body = null;
        }
        resolve({ raw, body });
    });
    req.on('error', () => {
        clearTimeout(timer);
        resolve({ raw: null, body: null });
    });
});

const signatureMatches = (raw, signature, secret) => {
    const expected = Buffer.from(crypto.createHmac('sha256', secret).update(raw).digest('hex'), 'hex');
    const actual = Buffer.from(String(signature || ''), 'hex');
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
};

// Orders created before pending_payments existed carry no `kind` note.
const orderKind = (pending, rzpOrder) => {
    if (pending?.kind) return pending.kind;
    const notes = rzpOrder.notes || {};
    if (notes.kind) return notes.kind;
    if (notes.productId) return 'horoscope';
    if (String(rzpOrder.receipt || '').startsWith('AYD-')) return 'shop';
    return null;
};

export const handleRazorpayWebhook = async (req, res) => {
    const { raw, body } = await readRawBody(req);
    if (!body || typeof body !== 'object') {
        sendJson(res, 400, { error: 'Invalid JSON body' });
        return;
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    let signature;
    if (raw === null) signature = 'unavailable';
    else if (!secret) signature = 'not-configured';
    else if (signatureMatches(raw, req.headers['x-razorpay-signature'], secret)) signature = 'verified';
    else {
        sendJson(res, 400, { error: 'Invalid webhook signature.' });
        return;
    }

    // Anything else Razorpay sends is acknowledged so it isn't retried.
    if (!HANDLED_EVENTS.includes(body.event)) {
        sendJson(res, 200, { ok: true, ignored: `event ${body.event || 'unknown'}`, signature });
        return;
    }

    const payloadPayment = body.payload?.payment?.entity || {};
    const payloadOrder = body.payload?.order?.entity || null;
    const paymentId = String(payloadPayment.id || '');
    const orderId = String(payloadPayment.order_id || payloadOrder?.id || '');
    if (!/^pay_[A-Za-z0-9]+$/.test(paymentId) || !/^order_[A-Za-z0-9]+$/.test(orderId)) {
        sendJson(res, 200, { ok: true, ignored: 'not an order payment', signature });
        return;
    }

    try {
        const pendingSnap = await adminDb().collection('pending_payments').doc(orderId).get();
        const pending = pendingSnap.exists ? pendingSnap.data() : null;
        if (signature !== 'verified' && !pending) {
            sendJson(res, 200, { ok: true, ignored: 'unknown checkout', signature });
            return;
        }
        if (pending?.status === 'paid') {
            sendJson(res, 200, { ok: true, alreadyProcessed: true, signature });
            return;
        }

        let payment = payloadPayment;
        let rzpOrder = payloadOrder;
        if (signature !== 'verified' || !rzpOrder) {
            try {
                [payment, rzpOrder] = await Promise.all([
                    razorpay.payments.fetch(paymentId),
                    razorpay.orders.fetch(orderId)
                ]);
            } catch (err) {
                // A payment id Razorpay doesn't know will never succeed - don't make it retry.
                if (err.statusCode === 400 || err.statusCode === 404) {
                    sendJson(res, 200, { ok: true, ignored: 'payment not found at Razorpay', signature });
                    return;
                }
                throw err;
            }
        }

        if (payment.status !== 'captured' || payment.order_id !== rzpOrder.id) {
            sendJson(res, 200, { ok: true, ignored: `payment ${payment.status}`, signature });
            return;
        }

        const kind = orderKind(pending, rzpOrder);
        let result;
        if (kind === 'shop') {
            result = await finalizeShopPayment({ razorpayOrder: rzpOrder, paymentId, via: 'webhook', payment });
        } else if (kind === 'horoscope') {
            result = await recordHoroscopePayment({ razorpayOrder: rzpOrder, paymentId, via: 'webhook', payment });
        } else {
            sendJson(res, 200, { ok: true, ignored: 'not a site order', signature });
            return;
        }
        sendJson(res, 200, { ok: true, kind, alreadyProcessed: result.alreadyProcessed, signature });
    } catch (err) {
        // Non-2xx makes Razorpay retry with backoff, which covers transient Firestore/API failures.
        console.error('Razorpay webhook failed:', err);
        sendJson(res, 500, { error: 'Webhook processing failed.' });
    }
};
