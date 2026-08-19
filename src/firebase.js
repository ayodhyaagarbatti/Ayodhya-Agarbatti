import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDZ8SroAsDtJnmkO2Ujbu9GqsEFl0kkZrk",
    authDomain: "ayodhya-agarbatti.firebaseapp.com",
    projectId: "ayodhya-agarbatti",
    storageBucket: "ayodhya-agarbatti.firebasestorage.app",
    messagingSenderId: "562396230666",
    appId: "1:562396230666:web:75db728a3391bdf5791bf3",
    measurementId: "G-JSEME84EMY"
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

export { analytics };
export default app;
