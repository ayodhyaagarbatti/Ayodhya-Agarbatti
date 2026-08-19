import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin, Lock, CreditCard, Banknote, CheckCircle, ShieldCheck, Truck, Check } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { logCheckoutStep } from '../utils/analyticsLogger';
import SEO from '../components/SEO';

const checkoutSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Secure Checkout | Ayodhya Agarbatti",
    "description": "Complete your secure purchase of premium charcoal-free incense sticks from Ayodhya Agarbatti. Multiple payment options including Razorpay and Cash on Delivery.",
    "url": "https://www.ayodhyaagarbatti.in/checkout",
    "publisher": {
        "@type": "Organization",
        "name": "Ayodhya Agarbatti",
        "logo": "https://www.ayodhyaagarbatti.in/images/ayodhya_logo.png"
    },
    "mainEntity": {
        "@type": "Order",
        "description": "Purchase Ayodhya Agarbatti sacred incense sticks with secure checkout",
        "merchant": {
            "@type": "Organization",
            "name": "Ayodhya Agarbatti"
        },
        "acceptedPaymentMethod": [
            "https://schema.org/CreditCard",
            "https://schema.org/PaymentCard",
            "Cash"
        ]
    }
};

const breadcrumbs = [
    { name: 'Home', url: 'https://www.ayodhyaagarbatti.in/' },
    { name: 'Shop', url: 'https://www.ayodhyaagarbatti.in/shop' },
    { name: 'Checkout', url: 'https://www.ayodhyaagarbatti.in/checkout' }
];

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

const Steps = ({ currentStep }) => {
    const steps = [
        { num: 1, label: 'Address' },
        { num: 2, label: 'Review' },
        { num: 3, label: 'Payment' }
    ];
    return (
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-12">
            {steps.map((s, idx) => (
                <div key={s.num} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= s.num ? 'bg-gold text-charcoal' : 'bg-gray-200 text-gray-500'}`}>
                        {currentStep > s.num ? <Check size={16} /> : s.num}
                    </div>
                    <span className={`text-sm font-medium ${currentStep >= s.num ? 'text-charcoal font-semibold' : 'text-gray-400'}`}>
                        {s.label}
                    </span>
                    {idx < steps.length - 1 && (
                        <div className={`h-0.5 w-8 md:w-16 ml-2 ${currentStep > s.num ? 'bg-gold' : 'bg-gray-200'}`} />
                    )}
                </div>
            ))}
        </div>
    );
};

const Checkout = ({ cartItems = [], onClearCart }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        const stepNames = { 1: 'Address Form', 2: 'Order Review', 3: 'Payment Method Selection' };
        logCheckoutStep(step, stepNames[step] || 'Checkout', { total, itemCount: cartItems.length });
    }, [step]);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        pincode: '',
        phone: '',
        email: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = (e) => {
        e.preventDefault();
        logCheckoutStep(1, 'Address Submitted', { customerName: `${formData.firstName} ${formData.lastName}`, email: formData.email, city: formData.city });
        setStep(2);
    };

    const total = cartItems.reduce((acc, item) => {
        const priceNum = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
        return acc + priceNum * item.quantity;
    }, 0);

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        const orderNumber = `AYD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        try {
            if (paymentMethod === 'cod') {
                const newOrder = {
                    orderNumber: orderNumber,
                    customer: {
                        name: `${formData.firstName} ${formData.lastName}`.trim(),
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
                        street: formData.address,
                        city: formData.city,
                        pincode: formData.pincode,
                        phone: formData.phone,
                        email: formData.email,
                        paymentMethod: 'Cash on Delivery'
                    },
                    items: cartItems.map(item => ({
                        id: item.id,
                        name: item.name,
                        variant: item.variant || '',
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image || ''
                    })),
                    subtotal: total,
                    shipping: 0,
                    total: total,
                    paymentId: 'COD',
                    paymentStatus: 'Pending COD',
                    status: 'Order Placed',
                    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    createdAt: serverTimestamp()
                };
                await saveAndRedirect(newOrder);
            } else {
                // Razorpay Logic - Ensure Razorpay script loaded
                const res = await loadRazorpayScript();
                if (!res || typeof window.Razorpay === 'undefined') {
                    alert('Razorpay Payment Gateway failed to load. Please check your internet connection.');
                    setIsProcessing(false);
                    return;
                }

                const options = {
                    key: "rzp_live_SVqG1GXacFfPNP",
                    amount: total * 100,
                    currency: "INR",
                    name: "Ayodhya Agarbatti",
                    description: "Sacred Fragrances Order",
                    image: "/images/ayodhya_logo.png",
                    handler: async function (response) {
                        try {
                            const newOrder = {
                                orderNumber: orderNumber,
                                paymentId: response.razorpay_payment_id || 'RZP-ONLINE',
                                customer: {
                                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                                    firstName: formData.firstName,
                                    lastName: formData.lastName,
                                    address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
                                    street: formData.address,
                                    city: formData.city,
                                    pincode: formData.pincode,
                                    phone: formData.phone,
                                    email: formData.email,
                                    paymentMethod: 'Razorpay Online'
                                },
                                items: cartItems.map(item => ({
                                    id: item.id,
                                    name: item.name,
                                    variant: item.variant || '',
                                    price: item.price,
                                    quantity: item.quantity,
                                    image: item.image || ''
                                })),
                                subtotal: total,
                                shipping: 0,
                                total: total,
                                paymentStatus: 'Paid',
                                status: 'Order Placed',
                                date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                                createdAt: serverTimestamp()
                            };
                            await saveAndRedirect(newOrder);
                        } catch (error) {
                            console.error("Error saving razorpay order:", error);
                            alert("Payment completed but failed to write order to database. Please contact support.");
                            setIsProcessing(false);
                        }
                    },
                    prefill: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        contact: formData.phone
                    },
                    theme: {
                        color: "#D4AF37"
                    },
                    modal: {
                        ondismiss: function () {
                            setIsProcessing(false);
                        }
                    }
                };
                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    alert('Payment Failed: ' + (response.error.description || 'Transaction unsuccessful'));
                    setIsProcessing(false);
                });
                rzp1.open();
            }
        } catch (error) {
            console.error("Order processing failed:", error);
            setIsProcessing(false);
            alert("Order placement error: " + (error.message || "Please check internet connection"));
        }
    };

    const saveAndRedirect = async (orderData) => {
        try {
            // Clean payload to eliminate any undefined values for Firestore compatibility
            const cleanOrderData = JSON.parse(JSON.stringify(orderData, (key, value) => 
                value === undefined ? null : value
            ));

            // 1. Save to LocalStorage Backup
            const existingBackup = JSON.parse(localStorage.getItem('ayodhya_orders') || '[]');
            const backupId = cleanOrderData.orderNumber || `AYD-${Date.now()}`;
            const backupOrder = { ...cleanOrderData, id: backupId };
            localStorage.setItem('ayodhya_orders', JSON.stringify([backupOrder, ...existingBackup]));

            let docId = backupId;

            // 2. Save order to Firebase Firestore Database ("orders" collection)
            try {
                const docRef = await addDoc(collection(db, "orders"), {
                    ...cleanOrderData,
                    createdAt: serverTimestamp()
                });
                docId = docRef.id;
                console.log("Order successfully written to Firestore DB with ID: ", docId);
            } catch (firestoreError) {
                console.warn("Firestore write notice (using backup store):", firestoreError);
            }

            const finalOrder = { ...cleanOrderData, id: docId };

            // Clear Cart after order saved
            onClearCart();

            // Redirect to Success Page
            navigate("/success", { state: { order: finalOrder } });
        } catch (e) {
            console.error("Error processing order storage: ", e);
            alert("Failed to place order. Error: " + (e.message || "Unknown error"));
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-32 text-center bg-gray-50 flex flex-col items-center justify-center">
                <ShoppingBag size={48} className="text-gray-300 mb-4" />
                <h2 className="text-2xl font-heading mb-4 text-charcoal">Your bag is empty.</h2>
                <button onClick={() => navigate('/shop')} className="btn-primary bg-charcoal text-white hover:bg-gold hover:text-charcoal">Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ivory/50 pt-28 pb-12">
            <SEO
                title="Secure Checkout | Ayodhya Agarbatti - Complete Your Order"
                description="Complete your secure purchase of premium charcoal-free incense sticks from Ayodhya Agarbatti. Multiple payment options including Razorpay (UPI, Cards, Netbanking) and Cash on Delivery. Free shipping on orders above ₹999."
                keywords="checkout Ayodhya Agarbatti, secure payment incense, buy agarbatti online payment, razorpay checkout, cash on delivery incense, order sacred fragrances"
                canonical="https://www.ayodhyaagarbatti.in/checkout"
                ogImage="https://www.ayodhyaagarbatti.in/images/ayodhya_package.png"
                ogType="website"
                schema={checkoutSchema}
                breadcrumbs={breadcrumbs}
                ogTitle="Secure Checkout | Ayodhya Agarbatti"
                ogDescription="Complete your order of hand-rolled sacred incense from Ayodhya. Secure payment with Razorpay or COD."
            />
            <div className="max-w-6xl mx-auto px-6">
                <Steps currentStep={step} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Flow Content */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="address"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                                >
                                    <h2 className="font-heading text-xl mb-6 flex items-center gap-2">
                                        <MapPin className="text-gold" size={20} /> Shipping Address
                                    </h2>
                                    <form id="address-form" onSubmit={nextStep} className="space-y-5 sm:space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">First Name</label>
                                                <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 p-3.5 sm:p-4 rounded-lg focus:outline-none focus:border-gold transition-colors text-base sm:text-sm" placeholder="First Name" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
                                                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 p-3.5 sm:p-4 rounded-lg focus:outline-none focus:border-gold transition-colors text-base sm:text-sm" placeholder="Last Name" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Street Address</label>
                                            <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 p-3.5 sm:p-4 rounded-lg focus:outline-none focus:border-gold transition-colors text-base sm:text-sm" placeholder="House No, Street Name" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">City</label>
                                                <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 p-3.5 sm:p-4 rounded-lg focus:outline-none focus:border-gold transition-colors text-base sm:text-sm" placeholder="City" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Pincode</label>
                                                <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 p-3.5 sm:p-4 rounded-lg focus:outline-none focus:border-gold transition-colors text-base sm:text-sm" placeholder="ZIP Code" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                                                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 p-3.5 sm:p-4 rounded-lg focus:outline-none focus:border-gold transition-colors text-base sm:text-sm" placeholder="+91 98765 43210" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                                                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 p-3.5 sm:p-4 rounded-lg focus:outline-none focus:border-gold transition-colors text-base sm:text-sm" placeholder="email@address.com" />
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full bg-charcoal text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-gold hover:text-charcoal transition-all mt-4 text-xs sm:text-sm">
                                            Continue to Review
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="review"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="font-heading text-xl flex items-center gap-2">
                                                <ShoppingBag className="text-gold" size={20} /> Order Review
                                            </h2>
                                            <button onClick={() => setStep(1)} className="text-xs text-gold underline">Edit Address</button>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                                                <p className="font-bold text-charcoal mb-1">Shipping to:</p>
                                                <p>{formData.firstName} {formData.lastName}</p>
                                                <p>{formData.address}</p>
                                                <p>{formData.city}, {formData.pincode}</p>
                                                <p className="mt-2">{formData.phone}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {cartItems.map(item => (
                                                <div key={item.id} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                                                    <img src={item.image} className="w-20 h-20 object-cover rounded-md" alt="" />
                                                    <div className="flex-1">
                                                        <div className="flex justify-between mb-1">
                                                            <h4 className="font-heading text-sm text-charcoal">{item.name}</h4>
                                                            <span className="font-bold text-sm">₹{parseInt(item.price.replace(/[^0-9]/g, '')) * item.quantity}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mb-2">{item.price} x {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={() => setStep(3)} className="w-full bg-charcoal text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-gold hover:text-charcoal transition-all">
                                        Continue to Payment
                                    </button>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                                >
                                    <h2 className="font-heading text-xl mb-6 flex items-center gap-2">
                                        <Lock className="text-gold" size={20} /> Payment Method
                                    </h2>

                                    <div className="space-y-4 mb-8">
                                        <div
                                            onClick={() => setPaymentMethod('razorpay')}
                                            className={`p-6 border rounded-xl cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'razorpay' ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <CreditCard className={paymentMethod === 'razorpay' ? 'text-charcoal' : 'text-gray-400'} />
                                                <div>
                                                    <p className="font-bold text-gray-900">Razorpay Secure</p>
                                                    <p className="text-xs text-gray-500">UPI, Credit/Debit Card, Netbanking</p>
                                                </div>
                                            </div>
                                            {paymentMethod === 'razorpay' && <CheckCircle className="text-gold" />}
                                        </div>

                                        <div
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`p-6 border rounded-xl cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'cod' ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <Banknote className={paymentMethod === 'cod' ? 'text-charcoal' : 'text-gray-400'} />
                                                <div>
                                                    <p className="font-bold text-gray-900">Cash on Delivery</p>
                                                    <p className="text-xs text-gray-500">Pay when your order arrives</p>
                                                </div>
                                            </div>
                                            {paymentMethod === 'cod' && <CheckCircle className="text-gold" />}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={isProcessing}
                                        className="w-full bg-gold text-charcoal py-5 rounded-lg font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Lock size={16} /> {isProcessing ? 'Processing Order...' : `Pay ₹${total} & Place Order`}
                                    </button>
                                    <div className="text-center mt-4 text-[10px] uppercase tracking-widest text-gray-400 flex items-center justify-center gap-2">
                                        <ShieldCheck size={14} /> SSL Secured • 256-Bit Encrypted
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Sticky Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:sticky lg:top-32">
                            <h3 className="font-heading text-lg mb-6 text-charcoal">Price Details</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>₹{total}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 pt-4 flex justify-between items-center mb-6">
                                <span className="font-bold text-lg text-charcoal">Total Amount</span>
                                <span className="font-bold text-xl text-gold">₹{total}</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3">
                                <Truck size={20} className="text-charcoal shrink-0 mt-1" />
                                <div>
                                    <p className="text-xs font-bold text-gray-900 uppercase">Estimated Delivery</p>
                                    <p className="text-xs text-gray-500 mt-1">3-5 Business Days provided by our premium logistics partners.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
