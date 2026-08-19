import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-ivory flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="font-serif text-9xl text-gold/20 font-bold mb-4">404</h1>
                <h2 className="font-heading text-xl text-charcoal uppercase tracking-[0.2em] mb-6">Path Not Found</h2>
                <p className="font-body text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
                    Like a fading scent, the page you seek has drifted away.
                    Let us guide you back to the sanctuary.
                </p>

                <Link to="/" className="inline-flex items-center gap-2 bg-charcoal text-white px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-gold transition-all shadow-lg group">
                    <Home size={16} className="group-hover:scale-110 transition-transform" />
                    Return Home
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
