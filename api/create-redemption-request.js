import readJsonBody from './_readJsonBody.js';
import { adminDb, FieldValue } from './_firebaseAdmin.js';
import { verifyIdTokenFromRequest } from './_verifyIdToken.js';

const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
};

const LOW_BALANCE_THRESHOLD_PAISE = 50000; // ₹500
const LOW_BALANCE_FEE_PAISE = 5000; // ₹50

const validatePayoutDetails = (payoutMethod, payoutDetails) => {
    if (payoutMethod === 'upi') {
        if (!payoutDetails?.upiId?.trim()) throw new Error('UPI ID is required.');
        return { upiId: payoutDetails.upiId.trim() };
    }
    if (payoutMethod === 'bank') {
        const { accountNumber, ifsc, accountHolderName } = payoutDetails || {};
        if (!accountNumber?.trim() || !ifsc?.trim() || !accountHolderName?.trim()) {
            throw new Error('Account number, IFSC and account holder name are required.');
        }
        return { accountNumber: accountNumber.trim(), ifsc: ifsc.trim().toUpperCase(), accountHolderName: accountHolderName.trim() };
    }
    throw new Error('payoutMethod must be "upi" or "bank".');
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed' });
        return;
    }

    const decoded = await verifyIdTokenFromRequest(req);
    if (!decoded) {
        sendJson(res, 401, { error: 'Sign in required.' });
        return;
    }
    if (!decoded.email_verified) {
        sendJson(res, 403, { error: 'Please verify your email to redeem your wallet.' });
        return;
    }

    let body;
    try {
        body = await readJsonBody(req);
    } catch (err) {
        sendJson(res, 400, { error: 'Invalid JSON body' });
        return;
    }

    let payoutDetails;
    try {
        payoutDetails = validatePayoutDetails(body.payoutMethod, body.payoutDetails);
    } catch (err) {
        sendJson(res, 400, { error: err.message });
        return;
    }

    const db = adminDb();
    const userRef = db.collection('users').doc(decoded.uid);
    const requestRef = db.collection('redemption_requests').doc();

    try {
        const result = await db.runTransaction(async (tx) => {
            const userSnap = await tx.get(userRef);
            const available = userSnap.exists ? (userSnap.data().walletBalance || 0) : 0;

            if (available <= 0) {
                throw new Error('Your wallet balance is ₹0 - nothing to redeem.');
            }

            const feePaise = available < LOW_BALANCE_THRESHOLD_PAISE ? LOW_BALANCE_FEE_PAISE : 0;
            if (available <= feePaise) {
                throw new Error(`Your balance is too low to redeem after the ₹${feePaise / 100} fee.`);
            }
            const netPayoutPaise = available - feePaise;

            tx.set(userRef, {
                walletBalance: FieldValue.increment(-available),
                walletPendingRedemption: FieldValue.increment(available)
            }, { merge: true });

            tx.set(requestRef, {
                uid: decoded.uid,
                requestedAmountPaise: available,
                feePaise,
                netPayoutPaise,
                status: 'pending',
                payoutMethod: body.payoutMethod,
                payoutDetails,
                createdAt: FieldValue.serverTimestamp(),
                resolvedAt: null,
                resolvedBy: null
            });

            return { requestedAmountPaise: available, feePaise, netPayoutPaise };
        });

        sendJson(res, 200, { requestId: requestRef.id, ...result });
    } catch (err) {
        sendJson(res, 400, { error: err.message || 'Could not create redemption request.' });
    }
}
