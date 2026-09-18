import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

// Analytics & Fine-grained Event Logging
import { logPageView, logCartAction } from './utils/analyticsLogger';
import { trackPageView, trackAddToCart } from './utils/googleAnalytics';
import { getLenisInstance } from './utils/lenisInstance';

// Components
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Footer from './components/Footer';
import ProductSection from './components/ProductSection';
import LenisScroll from './components/LenisScroll';
import CustomCursor from './components/CustomCursor';
import PaymentSuccess from './components/PaymentSuccess';
import Preloader from './components/Preloader';
import SearchModal from './components/SearchModal';

// Pages
import Home from './pages/Home';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import ReturnPolicy from './pages/ReturnPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ShippingPolicy from './pages/ShippingPolicy';
import CompletionRitual from './pages/CompletionRitual';
import NotFound from './pages/NotFound';
import HoroscopeLanding from './pages/horoscope/HoroscopeLanding';
import HoroscopeDetailsForm from './pages/horoscope/HoroscopeDetailsForm';
import HoroscopePayment from './pages/horoscope/HoroscopePayment';
import HoroscopeResult from './pages/horoscope/HoroscopeResult';
import AccountWallet from './pages/AccountWallet';

const TopBar = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('ayodhya_lang', lng);
    };

    const currentLang = i18n.language || 'en';
    const isEn = currentLang.startsWith('en');
    const isHi = currentLang.startsWith('hi');

    return (
        <div className="bg-charcoal text-ivory text-[10px] font-bold tracking-[0.2em] text-center py-2 uppercase border-b border-white/10 flex items-center justify-between px-4 md:px-8 relative z-[60]">
            {/* Spacer to balance the language selector */}
            <div className="shrink-0 invisible px-2.5 py-1 text-[9px]" aria-hidden="true">EN | हिंदी</div>

            <div className="flex-1 flex items-center justify-center">
                <span className="moving-text">{t('topBar')}</span>
            </div>

            {/* i18n Language Selector */}
            <div className="flex items-center gap-1.5 shrink-0 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 text-[9px] relative z-10">
                <Globe size={11} className="text-gold" />
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        changeLanguage('en');
                    }}
                    className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${isEn ? 'bg-gold text-charcoal font-black' : 'text-white/70 hover:text-white'}`}
                >
                    EN
                </button>
                <span className="text-white/30">|</span>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        changeLanguage('hi');
                    }}
                    className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${isHi ? 'bg-gold text-charcoal font-black' : 'text-white/70 hover:text-white'}`}
                >
                    हिंदी
                </button>
            </div>
        </div>
    );
};

// Automatic Route Navigation Activity & GA4 Tracker
const PageTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Lenis persists across route changes and otherwise clamps the old scroll
        // position onto the new (often shorter) page instead of resetting to top.
        const lenis = getLenisInstance();
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }

        logPageView(location.pathname, document.title);
        trackPageView(location.pathname, document.title);
    }, [location]);

    return null;
};

function AppContent() {
    const [isLoading, setIsLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Initialize Cart from LocalStorage & sanitize prices/images
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cartItems');
        if (!saved) return [];
        try {
            const parsed = JSON.parse(saved);
            return parsed.map(item => {
                const matchedProduct = products.find(p => p.id === item.id);
                // Prefer what was actually saved (respects the currency/price the item
                // was added at) over the current INR catalog price, which would
                // otherwise silently flip a restored USD cart item back to INR.
                const numericPrice = item.numericPrice || matchedProduct?.numericPrice || 70;
                const priceStr = item.price || matchedProduct?.price || `₹${numericPrice}`;
                const imageSrc = item.image || matchedProduct?.images?.[0] || item.images?.[0] || '/images/ayodhya_logo.png';
                return {
                    ...item,
                    price: priceStr,
                    numericPrice: numericPrice,
                    image: imageSrc
                };
            });
        } catch {
            return [];
        }
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    // Save to LocalStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const calculateCartTotal = (items) => {
        return items.reduce((acc, item) => {
            const priceNum = item.numericPrice || parseInt(String(item.price || '0').replace(/[^0-9]/g, '')) || 70;
            return acc + priceNum * (item.quantity || 1);
        }, 0);
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const addToCart = (product) => {
        setCartItems(prev => {
            const imageSrc = product.image || (product.images && product.images[0]) || '/images/ayodhya_logo.png';
            const priceStr = product.price || (product.numericPrice ? `₹${product.numericPrice}` : '₹70');
            const numericPrice = product.numericPrice || parseInt(String(priceStr).replace(/[^0-9]/g, '')) || 70;

            const itemWithDefaults = {
                ...product,
                image: imageSrc,
                price: priceStr,
                numericPrice: numericPrice
            };

            const existing = prev.find(item => item.id === product.id);
            let nextItems;
            if (existing) {
                nextItems = prev.map(item =>
                    item.id === product.id ? { 
                        ...item, 
                        ...itemWithDefaults, 
                        quantity: item.quantity + (product.quantity || 1) 
                    } : item
                );
            } else {
                nextItems = [...prev, { ...itemWithDefaults, quantity: product.quantity || 1 }];
            }

            // Log detailed minute cart addition event to database & GA4
            const cartTotal = calculateCartTotal(nextItems);
            const totalCount = nextItems.reduce((acc, i) => acc + i.quantity, 0);
            logCartAction('ADD_TO_CART', itemWithDefaults, cartTotal, totalCount);
            trackAddToCart(itemWithDefaults, product.quantity || 1);

            return nextItems;
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCartItems(prev => {
            const removedItem = prev.find(item => item.id === id);
            const nextItems = prev.filter(item => item.id !== id);

            // Log detailed cart removal event to database
            const cartTotal = calculateCartTotal(nextItems);
            const totalCount = nextItems.reduce((acc, i) => acc + i.quantity, 0);
            logCartAction('REMOVE_FROM_CART', removedItem, cartTotal, totalCount);

            return nextItems;
        });
    };

    const updateQuantity = (id, delta) => {
        setCartItems(prev => {
            const updatedItem = prev.find(item => item.id === id);
            const nextItems = prev.map(item => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });

            // Log detailed cart quantity update to database
            const cartTotal = calculateCartTotal(nextItems);
            const totalCount = nextItems.reduce((acc, i) => acc + i.quantity, 0);
            logCartAction('UPDATE_QUANTITY', updatedItem, cartTotal, totalCount);

            return nextItems;
        });
    };

    const clearCart = () => {
        logCartAction('CLEAR_CART', null, 0, 0);
        setCartItems([]);
    };

    return (
        <LenisScroll>
            <PageTracker />
            <div className="min-h-screen bg-ivory flex flex-col relative cursor-none">
                <AnimatePresence>
                    {isLoading && <Preloader key="preloader" />}
                </AnimatePresence>

                <CustomCursor />
                <div className="noise-overlay"></div>
                <header className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-auto">
                    <TopBar />
                    <Navbar
                        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                        onCartClick={toggleCart}
                        onSearchClick={() => setIsSearchOpen(true)}
                    />
                </header>

                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home addToCart={addToCart} />} />
                        <Route path="/shop" element={<ProductSection addToCart={addToCart} isStandaloneShop={true} />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/checkout" element={<Checkout cartItems={cartItems} onClearCart={clearCart} />} />
                        <Route path="/success" element={<PaymentSuccess />} />
                        <Route path="/return-policy" element={<ReturnPolicy />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                        <Route path="/shipping-policy" element={<ShippingPolicy />} />
                        <Route path="/completion-ritual" element={<CompletionRitual />} />
                        <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
                        <Route path="/horoscope" element={<HoroscopeLanding />} />
                        <Route path="/horoscope/:productId/details" element={<HoroscopeDetailsForm />} />
                        <Route path="/horoscope/:productId/payment" element={<HoroscopePayment />} />
                        <Route path="/horoscope/result" element={<HoroscopeResult />} />
                        <Route path="/account/wallet" element={<AccountWallet />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>

                <Footer />

                {/* Cart Drawer */}
                <AnimatePresence>
                    {isCartOpen && (
                        <Cart
                            isOpen={isCartOpen}
                            onClose={() => setIsCartOpen(false)}
                            items={cartItems}
                            onRemove={removeFromCart}
                            onUpdateQuantity={updateQuantity}
                        />
                    )}
                </AnimatePresence>

                {/* Search Modal */}
                <SearchModal
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                    addToCart={addToCart}
                />
            </div>
        </LenisScroll>
    );
}

function AdminApp() {
    return (
        <LenisScroll>
            <PageTracker />
            <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 md:px-8">
                <Admin />
            </div>
        </LenisScroll>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                {/* Admin route - standalone layout */}
                <Route path="/admin" element={<AdminApp />} />

                {/* Every other route - AppContent owns its own <Routes> internally */}
                <Route path="/*" element={<AppContent />} />
            </Routes>
        </Router>
    );
}

export default App;
