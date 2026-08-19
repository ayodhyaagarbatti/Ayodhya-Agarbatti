import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// Helper to get or create a session ID
const getSessionId = () => {
    let sid = sessionStorage.getItem('ayodhya_session_id');
    if (!sid) {
        sid = `SES-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        sessionStorage.setItem('ayodhya_session_id', sid);
    }
    return sid;
};

// Device & Browser Detection
const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let deviceType = "Desktop";
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
        deviceType = "Tablet";
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) {
        deviceType = "Mobile";
    }

    let browser = "Unknown";
    if (ua.indexOf("Chrome") > -1) browser = "Chrome";
    else if (ua.indexOf("Safari") > -1) browser = "Safari";
    else if (ua.indexOf("Firefox") > -1) browser = "Firefox";
    else if (ua.indexOf("Edge") > -1) browser = "Edge";

    return {
        deviceType,
        browser,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language || "en",
        userAgent: ua
    };
};

// Generic Logger
export const logActivity = async (type, details = {}) => {
    try {
        const sessionId = getSessionId();
        const deviceInfo = getDeviceInfo();

        const logEntry = {
            type, // PAGE_VIEW | CART_ACTION | CHECKOUT_STEP | USER_AUTH | SEARCH
            sessionId,
            device: deviceInfo.deviceType,
            browser: deviceInfo.browser,
            screenSize: deviceInfo.screenSize,
            timestamp: new Date().toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            }),
            details: JSON.parse(JSON.stringify(details, (k, v) => v === undefined ? null : v)),
            createdAt: serverTimestamp()
        };

        // 1. Local Storage Backup for Activity Logs
        try {
            const existingLogs = JSON.parse(localStorage.getItem('ayodhya_activity_logs') || '[]');
            const updatedLogs = [{ ...logEntry, id: `LOG-${Date.now()}` }, ...existingLogs.slice(0, 99)];
            localStorage.setItem('ayodhya_activity_logs', JSON.stringify(updatedLogs));
        } catch (e) {}

        // 2. Save to Firestore Database ("activity_logs" collection)
        await addDoc(collection(db, "activity_logs"), logEntry);
    } catch (err) {
        console.warn("Analytics logger note:", err.message);
    }
};

// Specialized Loggers
export const logPageView = (path, title) => {
    logActivity("PAGE_VIEW", {
        path,
        title: title || document.title,
        referrer: document.referrer || "Direct"
    });
};

export const logCartAction = (action, item, cartTotal, itemCount) => {
    logActivity("CART_ACTION", {
        action, // ADD_TO_CART | REMOVE_FROM_CART | UPDATE_QUANTITY | CLEAR_CART
        itemId: item?.id,
        itemName: item?.name,
        itemPrice: item?.price,
        itemQuantity: item?.quantity || 1,
        cartTotal,
        totalItemsInCart: itemCount
    });
};

export const logCheckoutStep = (stepNumber, stepName, extraData = {}) => {
    logActivity("CHECKOUT_STEP", {
        stepNumber,
        stepName, // Address | Review | Payment | Order Placed
        ...extraData
    });
};

export const logUserAuth = (action, userEmail, userName) => {
    logActivity("USER_AUTH", {
        action, // LOGIN | SIGNUP | LOGOUT | GUEST_SESSION
        email: userEmail,
        name: userName
    });
};

export const logSearchQuery = (query, resultCount) => {
    logActivity("SEARCH", {
        query,
        resultCount
    });
};
