import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Truck, Home, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
    const location = useLocation();
    const order = location.state?.order;

    useEffect(() => {
        // Scroll to top on load
        window.scrollTo(0, 0);
    }, []);

    if (!order) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p>Loading order details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pt-32">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white max-w-lg w-full p-8 md:p-12 rounded-2xl shadow-2xl text-center border border-gray-100 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-terracotta to-teal"></div>

                {/* Animated Checkmark */}
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                    >
                        <Check className="text-green-600 w-10 h-10" strokeWidth={3} />
                    </motion.div>
                </div>

                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                    Order #{order.id}
                </span>

                <h1 className="font-heading text-3xl text-gray-900 mb-2">Order Confirmed</h1>
                <p className="text-gray-500 font-body mb-8">Thank you for bringing divinity into your home.</p>

                <div className="bg-gray-50 p-6 rounded-xl mb-8 text-left">
                    <div className="flex items-start gap-4 mb-4">
                        <Truck className="text-terracotta shrink-0 mt-1" size={20} />
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Expected Delivery</h4>
                            <p className="text-gray-600 text-sm mt-1">
                                By {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Home className="text-terracotta shrink-0 mt-1" size={20} />
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Shipping To</h4>
                            <p className="text-gray-600 text-sm mt-1">
                                {order.customer.name} <br />
                                {order.customer.address}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <Link to="/" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-terracotta transition-colors flex-1">
                        Continue Shopping
                    </Link>
                    <Link to="/admin" className="inline-block bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <Search size={14} /> Track
                    </Link>
                </div>

            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
