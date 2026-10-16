// Client for api/public.js - the server-side path for everything Firestore rules
// deny to the client SDK (orders lookup, activity logs, subscribers, reviews,
// contact messages, user profiles).
export const callPublicApi = async (action, data = {}, idToken) => {
    const res = await fetch('/api/public', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(idToken ? { Authorization: `Bearer ${idToken}` } : {})
        },
        body: JSON.stringify({ action, ...data })
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.error || 'Request failed');
    return payload;
};

// Saves the signed-in user's name/email/photo to users/{uid}, at most once per
// browser session per user unless forced (e.g. right after sign-in).
export const syncUserProfile = async (firebaseUser, { force = false } = {}) => {
    if (!firebaseUser) return;
    const key = `ayodhya_profile_synced_${firebaseUser.uid}`;
    try {
        if (!force && sessionStorage.getItem(key)) return;
    } catch (e) {}
    const idToken = await firebaseUser.getIdToken();
    await callPublicApi('sync-profile', {}, idToken);
    try { sessionStorage.setItem(key, '1'); } catch (e) {}
};
