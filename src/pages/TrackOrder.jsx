import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle2, Truck, Home, XCircle, Search, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import { callPublicApi } from '../utils/publicApi';

// Matches ORDER_STATUSES in api/admin-data.js (minus 'Cancelled', shown separately).
const STEPS = [
    { status: 'Order Placed', label: 'Order Placed', icon: Package },
    { status: 'Processing', label: 'Processing', icon: Clock },
    { status: 'Shipped', label: 'Shipped', icon: Truck },
    { status: 'Delivered', label: 'Delivered', icon: Home }
];

const TrackOrder = () => {
    const [searchParams] = useSearchParams();
    const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
    const [phone, setPhone] = useState('');
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fromUrl = searchParams.get('order');
        if (fromUrl) setOrderNumber(fromUrl);
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setOrder(null);
        setLoading(true);
        try {
            const data = await callPublicApi('track-order', { orderNumber, phone });
            setOrder(data.order);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isCancelled = order?.status === 'Cancelled';
    const currentStep = order ? Math.max(0, STEPS.findIndex(s => s.status === order.status)) : 0;
    const symbol = order?.currency === 'USD' ? '$' : '₹';

    return (
        <div className="pt-32 pb-24 bg-ivory text-charcoal min-h-screen">
            <SEO
                title="Track Your Order | Ayodhya Agarbatti"
                description="Track your Ayodhya Agarbatti order status with your order number and phone number."
                canonical="https://www.ayodhyaagarbatti.in/track-order"
            />

            <div className="max-w-2xl mx-auto px-4 md:px-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 mb-8 font-bold">
                    <Link to="/" className="hover:text-gold transition-colors flex items-center gap-1">
                        <ArrowLeft size={14} /> Back to Sanctuary
                    </Link>
                    <span>/</span>
                    <span className="text-gold">Track Order</span>
                </div>

                <div className="text-center mb-10">
                    <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-3">Track Your Order</h1>
                    <p className="text-gray-600 text-sm">Enter the order number from your confirmation and the phone number you used at checkout.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-sm space-y-4 mb-8">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Order Number</label>
                        <input
                            type="text"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            placeholder="AYD-123456-1234"
                            required
                            className="w-full bg-white border border-gray-200 p-3 text-sm rounded-lg focus:outline-none focus:border-gold uppercase"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="10-digit mobile number"
                            required
                            className="w-full bg-white border border-gray-200 p-3 text-sm rounded-lg focus:outline-none focus:border-gold"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-charcoal text-white py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-gold hover:text-charcoal transition-all disabled:opacity-50"
                    >
                        <Search size={14} /> {loading ? 'Looking up...' : 'Track Order'}
                    </button>
                </form>

                {order && (
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-sm space-y-8">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Order #{order.orderNumber}</p>
                                <p className="text-sm text-gray-600 mt-1">Placed {order.date}{order.customerName ? ` by ${order.customerName}` : ''}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isCancelled ? 'bg-red-100 text-red-700' : 'bg-gold/15 text-charcoal'}`}>
                                {order.status}
                            </span>
                        </div>

                        {isCancelled ? (
                            <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl text-sm">
                                <XCircle size={20} className="shrink-0" /> This order was cancelled. Contact us if you have questions.
                            </div>
                        ) : (
                            <ol className="grid grid-cols-4 gap-2">
                                {STEPS.map((step, i) => {
                                    const done = i <= currentStep;
                                    const Icon = done ? CheckCircle2 : step.icon;
                                    return (
                                        <li key={step.status} className="flex flex-col items-center text-center gap-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${done ? 'bg-gold text-charcoal' : 'bg-gray-100 text-gray-400'}`}>
                                                <Icon size={18} />
                                            </div>
                                            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${done ? 'text-charcoal' : 'text-gray-400'}`}>{step.label}</span>
                                        </li>
                                    );
                                })}
                            </ol>
                        )}

                        <div>
                            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Items</h2>
                            <ul className="divide-y divide-gray-100 text-sm">
                                {order.items.map((item, i) => (
                                    <li key={i} className="py-3 flex justify-between gap-4">
                                        <span>
                                            {item.name}{item.pack ? <span className="text-gray-500"> · {item.pack}</span> : null}
                                            <span className="text-gray-500"> × {item.quantity}</span>
                                        </span>
                                        <span className="font-semibold whitespace-nowrap">{item.price}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t border-gray-200 pt-3 mt-1 space-y-1 text-sm">
                                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{symbol}{order.subtotal}</span></div>
                                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shipping ? `${symbol}${order.shipping}` : 'Free'}</span></div>
                                <div className="flex justify-between font-bold"><span>Total</span><span>{symbol}{order.total}</span></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Payment</p>
                                <p>{order.paymentMethod}{order.paymentStatus ? ` (${order.paymentStatus})` : ''}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Delivering To</p>
                                <p>{[order.city, order.pincode].filter(Boolean).join(' - ')}</p>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                            Need help? <Link to="/contact" className="text-gold font-bold hover:underline">Contact us</Link> with your order number.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
