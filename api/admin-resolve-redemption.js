import readJsonBody from './_readJsonBody.js';
import { verifySession } from './_adminSession.js';
import { adminDb, FieldValue } from './_firebaseAdmin.js';

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

    if (!verifySession(body.token, process.env.ADMIN_SESSION_SECRET)) {
        sendJson(res, 401, { error: 'Invalid or expired admin session.' });
        return;
    }

    const { requestId, action } = body;
    if (!requestId || !['paid', 'rejected'].includes(action)) {
        sendJson(res, 400, { error: 'requestId and a valid action ("paid" or "rejected") are required.' });
        return;
    }

    const db = adminDb();
    const requestRef = db.collection('redemption_requests').doc(requestId);

    try {
        await db.runTransaction(async (tx) => {
            const snap = await tx.get(requestRef);
            if (!snap.exists) throw new Error('Redemption request not found.');
            const data = snap.data();
            if (data.status !== 'pending') throw new Error(`Request is already ${data.status}.`);

            const userRef = db.collection('users').doc(data.uid);

            if (action === 'paid') {
                tx.set(userRef, {
                    walletPendingRedemption: FieldValue.increment(-data.requestedAmountPaise)
                }, { merge: true });

                const ledgerRef = db.collection('wallet_ledger').doc();
                tx.set(ledgerRef, {
                    uid: data.uid,
                    type: 'redemption_paid',
                    amountPaise: -data.requestedAmountPaise,
                    relatedOrderId: null,
                    relatedRedemptionId: requestRef.id,
                    createdAt: FieldValue.serverTimestamp(),
                    note: `Redemption paid out (fee ₹${data.feePaise / 100}, net ₹${data.netPayoutPaise / 100})`
                });
            } else {
                // Rejected: pending hold is released back into the spendable balance.
                tx.set(userRef, {
                    walletPendingRedemption: FieldValue.increment(-data.requestedAmountPaise),
                    walletBalance: FieldValue.increment(data.requestedAmountPaise)
                }, { merge: true });

                const ledgerRef = db.collection('wallet_ledger').doc();
                tx.set(ledgerRef, {
                    uid: data.uid,
                    type: 'redemption_rejected_refund',
                    amountPaise: 0,
                    relatedOrderId: null,
                    relatedRedemptionId: requestRef.id,
                    createdAt: FieldValue.serverTimestamp(),
                    note: 'Redemption request rejected, funds returned to wallet'
                });
            }

            tx.set(requestRef, {
                status: action,
                resolvedAt: FieldValue.serverTimestamp(),
                resolvedBy: 'admin'
            }, { merge: true });
        });

        sendJson(res, 200, { success: true });
    } catch (err) {
        sendJson(res, 400, { error: err.message || 'Could not resolve redemption request.' });
    }
}
