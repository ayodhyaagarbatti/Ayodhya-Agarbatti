import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase Analytics (its own separate GA4 property, G-HXQGTZF7WV) is intentionally
// not initialized here - src/utils/googleAnalytics.js already sends every event to
// the site's real GA4 property (G-K0D3Q6BJ2G) via gtag. Running both would silently
// split traffic across two different GA4 properties instead of duplicating into one.
const firebaseConfig = {
    apiKey: "AIzaSyD2CSxREZ2OghjhCM_AyX-yNN_6xsY_PAA",
    authDomain: "ayodhya-agarbatti-562e2.firebaseapp.com",
    projectId: "ayodhya-agarbatti-562e2",
    storageBucket: "ayodhya-agarbatti-562e2.firebasestorage.app",
    messagingSenderId: "811796036465",
    appId: "1:811796036465:web:8a321520534ec2dd4314d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);

// "Sign in with Google" - the OAuth consent screen used here is configured
// in Firebase Console > Authentication > Sign-in method > Google (Web client ID),
// not in this file. See VITE_GOOGLE_CLIENT_ID in .env for the ID that must be set there.
export const googleProvider = new GoogleAuthProvider();

export default app;
