import crypto from 'crypto';
import readJsonBody from './_readJsonBody.js';
import razorpay from './_razorpay.js';
import { adminDb, FieldValue } from './_firebaseAdmin.js';
import { horoscopeProducts } from '../src/data/horoscopeProducts.js';

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

    // Everything about what was actually charged (amount, coupon, referrer) comes
    // back from Razorpay's own record of the order, not from anything the client
    // says now - the order's `notes` were fixed at creation time in create-horoscope-order.js.
    let order;
    try {
        order = await razorpay.orders.fetch(razorpay_order_id);
    } catch (err) {
        sendJson(res, 500, { verified: true, error: 'Payment verified but could not read order details: ' + err.message });
        return;
    }

    const notes = order.notes || {};
    const productId = notes.productId || body.productId;
    const referrerUid = notes.referrerUid || null;
    const couponApplied = notes.couponApplied === 'true';
    const amountRupees = order.amount / 100;
    const product = horoscopeProducts.find((p) => p.id === productId);

    const db = adminDb();
    const orderRef = db.collection('horoscope_orders').doc(razorpay_payment_id); // deterministic id => idempotent
    const userRef = referrerUid ? db.collection('users').doc(referrerUid) : null;

    let alreadyProcessed = false;
    let commissionPaise = 0;

    try {
        await db.runTransaction(async (tx) => {
            const existing = await tx.get(orderRef);
            if (existing.exists) {
                alreadyProcessed = true;
                return;
            }

            if (referrerUid) {
                commissionPaise = Math.round(amountRupees * 100 * 0.10);
            }

            tx.set(orderRef, {
                orderNumber: orderNumber || razorpay_payment_id,
                productId,
                productName: product?.name || 'Vedic Horoscope Reading',
                amount: amountRupees,
                couponCode: couponApplied ? (body.couponCode || null) : null,
                couponApplied,
                referralCodeUsed: referrerUid ? (referralCode || null) : null,
                referrerUid,
                commissionPaise,
                commissionCredited: Boolean(referrerUid),
                razorpayOrderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                paymentStatus: 'Paid & Verified',
                customer: customer || null,
                subject: subject || null,
                partner: partner || null,
                date: date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                createdAt: FieldValue.serverTimestamp()
            });

            if (referrerUid && commissionPaise > 0) {
                const ledgerRef = db.collection('wallet_ledger').doc();
                tx.set(ledgerRef, {
                    uid: referrerUid,
                    type: 'commission',
                    amountPaise: commissionPaise,
                    relatedOrderId: orderRef.id,
                    relatedRedemptionId: null,
                    createdAt: FieldValue.serverTimestamp(),
                    note: `10% referral commission for order ${orderNumber || razorpay_payment_id}`
                });
                tx.set(userRef, { walletBalance: FieldValue.increment(commissionPaise) }, { merge: true });
            }
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
        alreadyProcessed,
        orderId: orderRef.id,
        commissionCredited: Boolean(referrerUid) && !alreadyProcessed
    });
}
