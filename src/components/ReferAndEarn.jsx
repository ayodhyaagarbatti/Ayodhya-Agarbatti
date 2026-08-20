import React, { useEffect, useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';
import { useAuthUser } from '../hooks/useAuthUser';

const ReferAndEarn = ({ onRequireSignIn = () => window.dispatchEvent(new CustomEvent('ayodhya:open-account')) }) => {
    const { user } = useAuthUser();
    const [referralCode, setReferralCode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const eligible = Boolean(user && user.emailVerified);

    useEffect(() => {
        if (!eligible) return;
        let cancelled = false;
        setIsLoading(true);
        setError('');
        user.getIdToken().then((token) =>
            fetch('/api/get-wallet-summary', { headers: { Authorization: `Bearer ${token}` } })
        ).then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Could not load your referral link.');
            if (!cancelled) setReferralCode(data.referralCode);
        }).catch((err) => {
            if (!cancelled) setError(err.message);
        }).finally(() => {
            if (!cancelled) setIsLoading(false);
        });
        return () => { cancelled = true; };
    }, [eligible, user]);

    const referralLink = referralCode ? `${window.location.origin}/horoscope?ref=${referralCode}` : '';

    const handleCopy = () => {
        if (!referralLink) return;
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!user) {
        return (
            <div className="bg-charcoal text-ivory rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Gift className="text-gold shrink-0" size={28} />
                    <div>
                        <h3 className="font-heading text-lg">Refer & Earn</h3>
                        <p className="text-xs text-white/70 mt-1">Sign in to get your referral link and earn 10% of every reading your friends buy.</p>
                    </div>
                </div>
                <button
                    onClick={onRequireSignIn}
                    className="bg-gold text-charcoal px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shrink-0"
                >
                    Sign In
                </button>
            </div>
        );
    }

    if (!eligible) {
        return (
            <div className="bg-charcoal text-ivory rounded-2xl p-6 md:p-8 flex items-center gap-3">
                <Gift className="text-gold shrink-0" size={28} />
                <p className="text-xs text-white/70">Verify your email to unlock your referral link and start earning 10% on every friend's purchase.</p>
            </div>
        );
    }

    return (
        <div className="bg-charcoal text-ivory rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
                <Gift className="text-gold shrink-0" size={28} />
                <div>
                    <h3 className="font-heading text-lg">Refer & Earn</h3>
                    <p className="text-xs text-white/70 mt-1">Earn 10% of what your friends pay for their reading, credited straight to your wallet.</p>
                </div>
            </div>

            {isLoading && <p className="text-xs text-white/50">Loading your link...</p>}
            {error && <p className="text-xs text-red-300">{error}</p>}

            {referralCode && (
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        readOnly
                        value={referralLink}
                        className="flex-1 bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white/90 truncate"
                    />
                    <button
                        onClick={handleCopy}
                        className="flex items-center justify-center gap-2 bg-gold text-charcoal px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shrink-0"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Link'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReferAndEarn;
