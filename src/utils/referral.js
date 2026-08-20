const STORAGE_KEY = 'ayodhya_referral_code';
const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const storeReferralCode = (code) => {
    if (!code) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ code: code.trim().toUpperCase(), storedAt: Date.now() }));
};

export const getStoredReferralCode = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const { code, storedAt } = JSON.parse(raw);
        if (!code || Date.now() - storedAt > EXPIRY_MS) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
        return code;
    } catch (e) {
        return null;
    }
};

export const clearStoredReferralCode = () => {
    localStorage.removeItem(STORAGE_KEY);
};
