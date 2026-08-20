import React, { useEffect, useState } from 'react';
import { Wallet, IndianRupee, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthUser } from '../hooks/useAuthUser';
import SEO from '../components/SEO';

const STATUS_META = {
    pending: { label: 'Pending', icon: Clock, className: 'bg-amber-100 text-amber-700' },
    paid: { label: 'Paid', icon: CheckCircle, className: 'bg-green-100 text-green-700' },
    rejected: { label: 'Rejected', icon: XCircle, className: 'bg-red-100 text-red-700' }
};

const AccountWallet = () => {
    const { user, loading } = useAuthUser();
    const [summary, setSummary] = useState(null);
    const [summaryError, setSummaryError] = useState('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [requests, setRequests] = useState([]);

    const [showRedeemForm, setShowRedeemForm] = useState(false);
    const [payoutMethod, setPayoutMethod] = useState('upi');
    const [upiId, setUpiId] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [isSubmittingRedeem, setIsSubmittingRedeem] = useState(false);
    const [redeemError, setRedeemError] = useState('');
    const [redeemSuccess, setRedeemSuccess] = useState('');

    const eligible = Boolean(user && user.emailVerified);

    const fetchSummary = async () => {
        if (!eligible) return;
        setIsLoadingSummary(true);
        setSummaryError('');
        try {
            const token = await user.getIdToken();
            const res = await fetch('/api/get-wallet-summary', { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Could not load wallet.');
            setSummary(data);
        } catch (err) {
            setSummaryError(err.message);
        } finally {
            setIsLoadingSummary(false);
        }
    };

    useEffect(() => {
        fetchSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eligible]);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'redemption_requests'), where('uid', '==', user.uid), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
        return unsub;
    }, [user]);

    const handleRedeemSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingRedeem(true);
        setRedeemError('');
        setRedeemSuccess('');
        try {
            const token = await user.getIdToken();
            const payoutDetails = payoutMethod === 'upi'
                ? { upiId }
                : { accountNumber, ifsc, accountHolderName };
            const res = await fetch('/api/create-redemption-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ payoutMethod, payoutDetails })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Could not submit redemption request.');
            setRedeemSuccess(`Redemption requested - you'll receive ₹${data.netPayoutPaise / 100}${data.feePaise > 0 ? ` (₹${data.feePaise / 100} fee deducted)` : ''} once processed.`);
            setShowRedeemForm(false);
            setUpiId(''); setAccountNumber(''); setIfsc(''); setAccountHolderName('');
            fetchSummary();
        } catch (err) {
            setRedeemError(err.message);
        } finally {
            setIsSubmittingRedeem(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen pt-32 bg-ivory/50" />;
    }

    if (!user) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-ivory/50 text-center px-6">
                <Wallet className="mx-auto text-gold mb-4" size={40} />
                <h1 className="font-heading text-2xl text-charcoal mb-3">Sign in to view your wallet</h1>
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('ayodhya:open-account'))}
                    className="btn-primary bg-charcoal text-white hover:bg-gold hover:text-charcoal"
                >
                    Sign In
                </button>
            </div>
        );
    }

    const balanceRupees = summary ? summary.walletBalance / 100 : 0;
    const pendingRupees = summary ? summary.walletPendingRedemption / 100 : 0;

    return (
        <div className="min-h-screen pt-28 pb-20 bg-ivory/50 px-6">
            <SEO
                title="My Wallet | Ayodhya Agarbatti"
                description="View your referral wallet balance and request a redemption."
                canonical="https://www.ayodhyaagarbatti.in/account/wallet"
                ogType="website"
            />
            <div className="max-w-3xl mx-auto">
                <Link to="/horoscope" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gold mb-6">
                    <ArrowLeft size={14} /> Back to readings
                </Link>

                <h1 className="font-heading text-2xl text-charcoal mb-6 flex items-center gap-2">
                    <Wallet className="text-gold" size={24} /> My Wallet
                </h1>

                {!eligible && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-lg mb-6">
                        Verify your email to unlock your wallet and referral earnings.
                    </div>
                )}

                {eligible && (
                    <>
                        {summaryError && <p className="text-red-500 text-sm mb-4">{summaryError}</p>}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <span className="text-xs text-gray-500 font-bold uppercase">Available Balance</span>
                                <div className="flex items-center gap-1 mt-1">
                                    <IndianRupee size={20} className="text-gold" />
                                    <span className="text-2xl font-bold text-charcoal">{isLoadingSummary ? '...' : balanceRupees.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <span className="text-xs text-gray-500 font-bold uppercase">Pending Redemption</span>
                                <div className="flex items-center gap-1 mt-1">
                                    <IndianRupee size={20} className="text-gray-400" />
                                    <span className="text-2xl font-bold text-charcoal">{isLoadingSummary ? '...' : pendingRupees.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {redeemSuccess && <p className="text-green-600 text-sm mb-4 bg-green-50 border border-green-200 p-3 rounded-lg">{redeemSuccess}</p>}

                        {!showRedeemForm ? (
                            <button
                                onClick={() => setShowRedeemForm(true)}
                                disabled={balanceRupees <= 0}
                                className="btn-primary bg-charcoal text-white hover:bg-gold hover:text-charcoal disabled:opacity-50 disabled:cursor-not-allowed mb-8"
                            >
                                Redeem ₹{balanceRupees.toFixed(2)}
                            </button>
                        ) : (
                            <form onSubmit={handleRedeemSubmit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8 space-y-4">
                                <p className="text-xs text-gray-500">
                                    {balanceRupees < 500
                                        ? 'Your balance is below ₹500 - a ₹50 fee will be deducted from your payout.'
                                        : 'No fee - your full balance will be paid out.'}
                                </p>
                                <div className="flex gap-4 text-sm">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" checked={payoutMethod === 'upi'} onChange={() => setPayoutMethod('upi')} /> UPI
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" checked={payoutMethod === 'bank'} onChange={() => setPayoutMethod('bank')} /> Bank Account
                                    </label>
                                </div>
                                {payoutMethod === 'upi' ? (
                                    <input
                                        required
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="yourname@upi"
                                        className="w-full bg-gray-50 border border-gray-200 p-3 text-sm rounded-lg focus:outline-none focus:border-gold"
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        <input
                                            required
                                            value={accountHolderName}
                                            onChange={(e) => setAccountHolderName(e.target.value)}
                                            placeholder="Account holder name"
                                            className="w-full bg-gray-50 border border-gray-200 p-3 text-sm rounded-lg focus:outline-none focus:border-gold"
                                        />
                                        <input
                                            required
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value)}
                                            placeholder="Account number"
                                            className="w-full bg-gray-50 border border-gray-200 p-3 text-sm rounded-lg focus:outline-none focus:border-gold"
                                        />
                                        <input
                                            required
                                            value={ifsc}
                                            onChange={(e) => setIfsc(e.target.value)}
                                            placeholder="IFSC code"
                                            className="w-full bg-gray-50 border border-gray-200 p-3 text-sm rounded-lg focus:outline-none focus:border-gold"
                                        />
                                    </div>
                                )}
                                {redeemError && <p className="text-red-500 text-xs">{redeemError}</p>}
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={isSubmittingRedeem}
                                        className="btn-primary bg-charcoal text-white hover:bg-gold hover:text-charcoal disabled:opacity-50"
                                    >
                                        {isSubmittingRedeem ? 'Submitting...' : 'Confirm Redemption'}
                                    </button>
                                    <button type="button" onClick={() => setShowRedeemForm(false)} className="text-xs text-gray-500 hover:text-charcoal">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {requests.length > 0 && (
                            <div className="mb-8">
                                <h2 className="font-heading text-lg text-charcoal mb-3">My Redemption Requests</h2>
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
                                    {requests.map((r) => {
                                        const meta = STATUS_META[r.status] || STATUS_META.pending;
                                        const StatusIcon = meta.icon;
                                        return (
                                            <div key={r.id} className="p-4 flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-charcoal">₹{(r.netPayoutPaise / 100).toFixed(2)} net payout</p>
                                                    <p className="text-xs text-gray-400">Requested ₹{(r.requestedAmountPaise / 100).toFixed(2)}{r.feePaise > 0 ? ` · ₹${(r.feePaise / 100).toFixed(2)} fee` : ''} · via {r.payoutMethod?.toUpperCase()}</p>
                                                </div>
                                                <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${meta.className}`}>
                                                    <StatusIcon size={12} /> {meta.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {summary?.recentLedger?.length > 0 && (
                            <div>
                                <h2 className="font-heading text-lg text-charcoal mb-3">Earnings History</h2>
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
                                    {summary.recentLedger.map((entry) => (
                                        <div key={entry.id} className="p-4 flex items-center justify-between gap-4 text-sm">
                                            <span className="text-gray-600">{entry.note || entry.type}</span>
                                            <span className={`font-bold ${entry.amountPaise >= 0 ? 'text-green-600' : 'text-gray-500'}`}>
                                                {entry.amountPaise >= 0 ? '+' : ''}₹{(entry.amountPaise / 100).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AccountWallet;
