import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-ivory flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
            <SEO
                title="Page Not Found | Ayodhya Agarbatti"
                description="The page you're looking for doesn't exist. Return to Ayodhya Agarbatti to shop hand-rolled incense sticks or get your Vedic horoscope reading."
                canonical="https://www.ayodhyaagarbatti.in/404"
                noindex={true}
            />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <p className="font-serif text-9xl text-gold/20 font-bold mb-4" aria-hidden="true">404</p>
                <h1 className="font-heading text-xl text-charcoal uppercase tracking-[0.2em] mb-6">Path Not Found</h1>
                <p className="font-body text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
                    Like a fading scent, the page you seek has drifted away.
                    Let us guide you back to the sanctuary.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link to="/" className="inline-flex items-center gap-2 bg-charcoal text-white px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-gold transition-all shadow-lg group">
                        <Home size={16} className="group-hover:scale-110 transition-transform" />
                        Return Home
                    </Link>
                    <Link to="/shop" className="inline-flex items-center gap-2 border border-charcoal text-charcoal px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-charcoal hover:text-white transition-all group">
                        <ShoppingBag size={16} className="group-hover:scale-110 transition-transform" />
                        Shop Incense
                    </Link>
                    <Link to="/horoscope" className="inline-flex items-center gap-2 border border-charcoal text-charcoal px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-charcoal hover:text-white transition-all group">
                        <Sparkles size={16} className="group-hover:scale-110 transition-transform" />
                        Horoscope
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
