import { adminDb } from './_firebaseAdmin.js';
import { verifyIdTokenFromRequest } from './_verifyIdToken.js';
import { generateReferralCode } from './_referralCode.js';

const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
};

const ensureReferralCode = async (db, uid, existingCode) => {
    if (existingCode) return existingCode;

    // Retry a few times in the unlikely event of a collision.
    for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = generateReferralCode();
        const clash = await db.collection('users').where('referralCode', '==', candidate).limit(1).get();
        if (clash.empty) {
            await db.collection('users').doc(uid).set({ referralCode: candidate }, { merge: true });
            return candidate;
        }
    }
    throw new Error('Could not generate a unique referral code, please try again.');
};

export default async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed' });
        return;
    }

    const decoded = await verifyIdTokenFromRequest(req);
    if (!decoded) {
        sendJson(res, 401, { error: 'Sign in required.' });
        return;
    }
    if (!decoded.email_verified) {
        sendJson(res, 403, { error: 'Please verify your email to access wallet & referral features.' });
        return;
    }

    const db = adminDb();
    const userRef = db.collection('users').doc(decoded.uid);

    try {
        const userSnap = await userRef.get();
        const userData = userSnap.exists ? userSnap.data() : {};

        const referralCode = await ensureReferralCode(db, decoded.uid, userData.referralCode);

        const ledgerSnap = await db.collection('wallet_ledger')
            .where('uid', '==', decoded.uid)
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();
        const recentLedger = ledgerSnap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toMillis?.() || null }));

        sendJson(res, 200, {
            walletBalance: userData.walletBalance || 0,
            walletPendingRedemption: userData.walletPendingRedemption || 0,
            referralCode,
            recentLedger
        });
    } catch (err) {
        console.error('Error fetching wallet summary:', err);
        sendJson(res, 500, { error: err.message || 'Failed to load wallet summary' });
    }
}
