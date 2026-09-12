import { useEffect, useState } from 'react';

// Defaults to India (the majority of traffic) so most visitors never see a currency
// flash while the one-time /api/detect-region call resolves; cached for the tab's
// session so we don't re-check on every route change.
const SESSION_KEY = 'ayodhya_region_is_india';

export const useRegion = () => {
    const [isIndia, setIsIndia] = useState(() => {
        const cached = sessionStorage.getItem(SESSION_KEY);
        return cached === null ? true : cached === 'true';
    });
    const [isReady, setIsReady] = useState(() => sessionStorage.getItem(SESSION_KEY) !== null);

    useEffect(() => {
        if (sessionStorage.getItem(SESSION_KEY) !== null) return;
        let cancelled = false;
        fetch('/api/detect-region')
            .then((res) => res.json())
            .then((data) => {
                if (cancelled) return;
                setIsIndia(Boolean(data.isIndia));
                sessionStorage.setItem(SESSION_KEY, String(Boolean(data.isIndia)));
            })
            .catch(() => {
                // Network hiccup - keep the India default rather than blocking rendering.
            })
            .finally(() => {
                if (!cancelled) setIsReady(true);
            });
        return () => { cancelled = true; };
    }, []);

    return { isIndia, isReady };
};
