import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { syncUserProfile } from '../utils/publicApi';

export const useAuthUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
            // Backfills name/email for accounts created while client writes were blocked.
            syncUserProfile(firebaseUser).catch(() => {});
        });
        return unsubscribe;
    }, []);

    return { user, loading };
};
