import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Server-only credentials (never VITE_-prefixed). Generate via Firebase Console
// > Project Settings > Service Accounts > Generate new private key.
const getAdminApp = () => {
    if (getApps().length) return getApps()[0];

    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    // Vercel env vars can't hold real newlines, so the key is stored with literal \n sequences.
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Firebase Admin is not configured. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY.');
    }

    return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
};

export const adminDb = () => getFirestore(getAdminApp());
export const adminAuth = () => getAuth(getAdminApp());
export { FieldValue };
