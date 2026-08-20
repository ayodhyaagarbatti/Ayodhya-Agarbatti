import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyD2CSxREZ2OghjhCM_AyX-yNN_6xsY_PAA",
    authDomain: "ayodhya-agarbatti-562e2.firebaseapp.com",
    projectId: "ayodhya-agarbatti-562e2",
    storageBucket: "ayodhya-agarbatti-562e2.firebasestorage.app",
    messagingSenderId: "811796036465",
    appId: "1:811796036465:web:8a321520534ec2dd4314d0",
    measurementId: "G-HXQGTZF7WV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;
try {
    if (typeof window !== 'undefined') {
        analytics = getAnalytics(app);
    }
} catch (e) {
    console.warn("Firebase analytics init skipped:", e);
}

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);

// "Sign in with Google" - the OAuth consent screen used here is configured
// in Firebase Console > Authentication > Sign-in method > Google (Web client ID),
// not in this file. See VITE_GOOGLE_CLIENT_ID in .env for the ID that must be set there.
export const googleProvider = new GoogleAuthProvider();

export { analytics };
export default app;
