import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

const Navbar = ({ cartCount, onCartClick, onSearchClick }) => {
    const { t } = useTranslation();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (item, e) => {
        if (item.key === 'navRituals' || item.name === 'Rituals') {
            e.preventDefault();
            if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                    document.getElementById('ritual')?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            } else {
                document.getElementById('ritual')?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const navClass = scrolled
        ? "bg-charcoal/95 backdrop-blur-md shadow-xl py-3 border-b border-gold/20"
        : "bg-gradient-to-b from-charcoal/70 to-transparent py-4";

    const textClass = "text-ivory";

    const navItems = [
        { name: t('navHome'), key: 'navHome', path: '/' },
        { name: t('navShop'), key: 'navShop', path: '/shop' },
        { name: t('navRituals'), key: 'navRituals', path: '/#ritual' },
        { name: t('navJournal'), key: 'navJournal', path: '/blog' },
        { name: '✨ Horoscope', key: 'navHoroscope', path: '/horoscope' },
        { name: t('navContact'), key: 'navContact', path: '/contact' }
    ];

    return (
        <nav className={`relative w-full z-40 transition-all duration-500 ease-in-out ${navClass}`}>
            {scrolled && <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>}

            <div className="container mx-auto px-6 flex justify-between items-center relative z-10">
                {/* Logo */}
                <Link to="/" className="block w-28 md:w-36 transition-transform hover:scale-105">
                    <img
                        src="/images/ayodhya_logo.png"
                        alt="Ayodhya Agarbatti Logo"
                        className="w-full h-auto block drop-shadow-md"
                    />
                </Link>

                {/* Desktop Menu */}
                <div className={`hidden md:flex items-center space-x-10 ${textClass}`}>
                    {navItems.map((item) => (
                        <Link
                            key={item.key}
                            to={item.path}
                            onClick={(e) => handleNavClick(item, e)}
                            className="text-xs font-bold uppercase tracking-[0.2em] hover:text-gold transition-all relative group py-1"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-1/2 w-0 h-[1.5px] bg-gold transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2 ease-out"></span>
                        </Link>
                    ))}
                </div>

                {/* Icons */}
                <div className={`flex items-center space-x-6 ${textClass}`}>
                    <button
                        onClick={onSearchClick}
                        aria-label="Search fragrances"
                        className="p-1.5 rounded-full hover:bg-white/10 transition-colors group relative"
                    >
                        <Search className="w-5 h-5 text-ivory group-hover:text-gold transition-colors" />
                    </button>

                    <Link
                        to="/admin"
                        title="Admin / Account"
                        aria-label="Account access"
                        className="p-1.5 rounded-full hover:bg-white/10 transition-colors group"
                    >
                        <User className="w-5 h-5 text-ivory group-hover:text-gold transition-colors" />
                    </Link>

                    <button
                        onClick={onCartClick}
                        aria-label="View Shopping Bag"
                        className="relative p-1.5 rounded-full hover:bg-white/10 transition-colors group cursor-pointer"
                    >
                        <ShoppingBag className="w-5 h-5 text-ivory group-hover:text-gold transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-gold text-charcoal text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-1.5" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu className="w-6 h-6 hover:text-gold transition-colors" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 bg-charcoal z-50 flex flex-col items-center justify-center p-8 space-y-8 text-ivory"
                    >
                        <button className="absolute top-8 right-8 p-2" onClick={() => setIsMobileMenuOpen(false)}>
                            <X className="w-8 h-8 text-ivory hover:text-gold" />
                        </button>

                        {[
                            { name: 'Home', path: '/' },
                            { name: 'Shop', path: '/shop' },
                            { name: 'Rituals', path: '/#ritual' },
                            { name: 'Journal', path: '/blog' },
                            { name: '✨ Horoscope', path: '/horoscope' },
                            { name: 'Contact', path: '/contact' },
                            { name: 'Admin Dashboard', path: '/admin' }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={(e) => {
                                    setIsMobileMenuOpen(false);
                                    handleNavClick(item, e);
                                }}
                                className="font-serif text-3xl hover:text-gold transition-colors tracking-wide"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
