import { adminAuth } from './_firebaseAdmin.js';

// Verifies the Firebase ID token from an "Authorization: Bearer <token>" header.
// Returns the decoded token (has .uid, .email, .email_verified) or null.
export const verifyIdTokenFromRequest = async (req) => {
    const header = req.headers.authorization || req.headers.Authorization || '';
    const match = /^Bearer\s+(.+)$/i.exec(header);
    if (!match) return null;
    try {
        return await adminAuth().verifyIdToken(match[1]);
    } catch (err) {
        return null;
    }
};
