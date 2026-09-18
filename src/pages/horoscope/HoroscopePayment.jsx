import React, { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowLeft, AlertTriangle } from 'lucide-react';
import SEO from '../../components/SEO';
import { getHoroscopeProduct } from '../../data/horoscopeProducts';
import { getStoredReferralCode, clearStoredReferralCode } from '../../utils/referral';
import { useRegion } from '../../hooks/useRegion';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// The Firestore write itself happens server-side in api/verify-horoscope-payment.js
// (so a money-adjacent write never depends on wide-open client Firestore rules) -
// this is just a local backup mirror in case the network drops right after payment.
const backupHoroscopeOrderLocally = (orderData) => {
    const cleanOrderData = JSON.parse(JSON.stringify(orderData, (key, value) => (value === undefined ? null : value)));
    const existingBackup = JSON.parse(localStorage.getItem('ayodhya_horoscope_orders') || '[]');
    const backupOrder = { ...cleanOrderData, id: cleanOrderData.orderNumber };
    localStorage.setItem('ayodhya_horoscope_orders', JSON.stringify([backupOrder, ...existingBackup]));
};

const HoroscopePayment = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const product = getHoroscopeProduct(productId);
    const { isIndia } = useRegion();
    const currencySymbol = isIndia ? '₹' : '$';
    const { subject, partner, contact } = location.state || {};
    const [isProcessing, setIsProcessing] = useState(false);
    const [payError, setPayError] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [couponStatus, setCouponStatus] = useState(null); // { amountRupees, couponApplied } | null
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [couponError, setCouponError] = useState('');

    if (!product) {
        return (
            <div className="min-h-screen pt-32 text-center bg-gray-50 flex flex-col items-center justify-center px-6">
                <h2 className="text-2xl font-heading mb-4 text-charcoal">That reading doesn't exist.</h2>
                <Link to="/horoscope" className="btn-primary bg-charcoal text-white hover:bg-gold hover:text-charcoal">View readings</Link>
            </div>
        );
    }

    if (!subject || !contact) {
        return (
            <div className="min-h-screen pt-32 text-center bg-gray-50 flex flex-col items-center justify-center px-6">
                <h2 className="text-2xl font-heading mb-4 text-charcoal">Let's start with your birth details.</h2>
                <Link
                    to={`/horoscope/${productId}/details`}
                    className="btn-primary bg-charcoal text-white hover:bg-gold hover:text-charcoal"
                >
                    Enter birth details
                </Link>
            </div>
        );
    }

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplyingCoupon(true);
        setCouponError('');
        try {
            const res = await fetch('/api/preview-horoscope-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, couponCode: couponCode.trim() })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Could not apply coupon');
            if (!data.couponApplied) {
                setCouponStatus(null);
                setCouponError('That coupon code is not valid.');
            } else {
                setCouponStatus(data);
            }
        } catch (error) {
            setCouponStatus(null);
            setCouponError(error.message);
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const displayPrice = !isIndia
        ? product.usdPrice
        : (couponStatus?.couponApplied ? couponStatus.amountRupees : product.price);

    const handlePay = async () => {
        if (isProcessing) return;
        if (!RAZORPAY_KEY_ID) {
            setPayError('Payment gateway is not configured yet. Set VITE_RAZORPAY_KEY_ID to enable payments.');
            return;
        }
        setPayError('');
        setIsProcessing(true);
        const orderNumber = `AYD-HORO-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

        const res = await loadRazorpayScript();
        if (!res || typeof window.Razorpay === 'undefined') {
            setPayError('Razorpay Payment Gateway failed to load. Please check your internet connection.');
            setIsProcessing(false);
            return;
        }

        // Order is created server-side (api/create-horoscope-order.js) so the amount
        // (and any coupon discount) can't be tampered with from the browser - the
        // server recomputes the price from productId+couponCode against the
        // canonical catalog, it never trusts a client-supplied amount.
        const referralCode = getStoredReferralCode();

        let order;
        try {
            const createRes = await fetch('/api/create-horoscope-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    couponCode: couponStatus?.couponApplied ? couponCode.trim() : null,
                    referralCode,
                    customerEmail: contact.email,
                    receipt: orderNumber
                })
            });
            const createData = await createRes.json();
            if (!createRes.ok) throw new Error(createData.error || 'Failed to create order');
            order = createData;
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            setPayError('Could not start payment: ' + error.message);
            setIsProcessing(false);
            return;
        }

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            order_id: order.order_id,
            name: 'Ayodhya Agarbatti',
            description: `${product.name} - Vedic Horoscope Reading`,
            image: '/images/ayodhya_logo.png',
            handler: async function (response) {
                try {
                    const orderCustomer = { name: subject.name, email: contact.email, phone: contact.phone };
                    const verifyRes = await fetch('/api/verify-horoscope-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderNumber,
                            productId,
                            couponCode: order.couponApplied ? couponCode.trim() : null,
                            referralCode,
                            customer: orderCustomer,
                            subject,
                            partner: partner || null,
                            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                        })
                    });
                    const verifyData = await verifyRes.json();
                    if (!verifyRes.ok || !verifyData.verified) {
                        setPayError('Payment could not be verified. If you were charged, please contact support with payment ID ' + response.razorpay_payment_id + '.');
                        setIsProcessing(false);
                        return;
                    }

                    backupHoroscopeOrderLocally({
                        orderNumber,
                        productId,
                        productName: product.name,
                        amount: order.amount / 100,
                        razorpayOrderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id,
                        paymentStatus: 'Paid & Verified',
                        customer: orderCustomer,
                        subject,
                        partner: partner || null
                    });
                    clearStoredReferralCode();
                    navigate('/horoscope/result', { state: { subject, partner, product } });
                } catch (error) {
                    console.error('Error finalizing horoscope order:', error);
                    setPayError('Payment verified but failed to record your order. Please contact support with your payment ID: ' + (response.razorpay_payment_id || ''));
                    setIsProcessing(false);
                }
            },
            prefill: {
                name: subject.name,
                email: contact.email,
                contact: contact.phone
            },
            theme: { color: '#D4AF37' },
            modal: { ondismiss: function () { setIsProcessing(false); } }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            setPayError('Payment failed: ' + (response.error?.description || 'Transaction unsuccessful'));
            setIsProcessing(false);
        });
        rzp1.open();
    };

    return (
        <div className="min-h-screen bg-ivory/50 pt-28 pb-12">
            <SEO
                title={`Pay for ${product.name} | Ayodhya Agarbatti`}
                description="Secure payment for your Vedic horoscope reading."
                canonical={`https://www.ayodhyaagarbatti.in/horoscope/${productId}/payment`}
                ogType="website"
                noindex={true}
            />
            <div className="max-w-xl mx-auto px-6">
                <Link to={`/horoscope/${productId}/details`} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gold mb-6">
                    <ArrowLeft size={14} /> Edit birth details
                </Link>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <h1 className="font-heading text-xl mb-6 flex items-center gap-2 text-charcoal">
                        <Lock className="text-gold" size={20} /> Payment
                    </h1>

                    <div className="bg-gray-50 p-5 rounded-lg mb-6 space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Reading</span><span className="font-semibold text-charcoal">{product.name}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">For</span><span className="font-semibold text-charcoal">{subject.name}{partner ? ` & ${partner.name}` : ''}</span></div>
                        {couponStatus?.couponApplied && (
                            <div className="flex justify-between text-xs"><span className="text-gray-500">Coupon</span><span className="font-semibold text-green-600">Applied</span></div>
                        )}
                        <div className="flex justify-between border-t border-gray-200 pt-2 mt-2"><span className="font-bold text-charcoal">Total</span><span className="font-bold text-gold text-lg">{currencySymbol}{displayPrice}</span></div>
                    </div>

                    {isIndia && (
                        <div className="mb-6">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Coupon Code</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => { setCouponCode(e.target.value); setCouponStatus(null); setCouponError(''); }}
                                    placeholder="Enter code"
                                    className="flex-1 bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-gold transition-colors uppercase"
                                />
                                <button
                                    type="button"
                                    onClick={applyCoupon}
                                    disabled={isApplyingCoupon || !couponCode.trim()}
                                    className="px-5 border border-charcoal text-charcoal text-xs font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all disabled:opacity-50"
                                >
                                    {isApplyingCoupon ? '...' : 'Apply'}
                                </button>
                            </div>
                            {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
                            {couponStatus?.couponApplied && <p className="text-green-600 text-xs mt-2">Coupon applied - total is now ₹{couponStatus.amountRupees}.</p>}
                        </div>
                    )}

                    {!RAZORPAY_KEY_ID && (
                        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-lg mb-4">
                            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                            Payment gateway not configured yet - set <code className="font-mono">VITE_RAZORPAY_KEY_ID</code> to enable checkout.
                        </div>
                    )}

                    {payError && (
                        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg mb-4">
                            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                            {payError}
                        </div>
                    )}

                    <button
                        onClick={handlePay}
                        disabled={isProcessing}
                        className="w-full bg-gold text-charcoal py-5 rounded-lg font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Lock size={16} /> {isProcessing ? 'Processing...' : `Pay ${currencySymbol}${displayPrice}`}
                    </button>
                    <div className="text-center mt-4 text-[10px] uppercase tracking-widest text-gray-400 flex items-center justify-center gap-2">
                        <ShieldCheck size={14} /> SSL Secured · 256-Bit Encrypted
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HoroscopePayment;
