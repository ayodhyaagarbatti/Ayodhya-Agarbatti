import React from 'react';
import { motion } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Cart = ({ isOpen, onClose, items, onRemove, onUpdateQuantity }) => {
    const { t } = useTranslation();

    // Parse price string (e.g. "₹299") to integer (299)
    const total = items.reduce((acc, item) => {
        const priceNum = item.numericPrice || parseInt(String(item.price || '0').replace(/[^0-9]/g, '')) || 299;
        return acc + (priceNum * item.quantity);
    }, 0);

    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        navigate("/checkout");
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-charcoal/20 z-50 backdrop-blur-sm"
            />
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-ivory z-50 border-l border-charcoal/5 p-6 flex flex-col shadow-2xl"
            >
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-charcoal/5">
                    <div className="flex items-center gap-3">
                        <h2 className="font-heading text-2xl text-charcoal">{t('yourBag')}</h2>
                        <span className="bg-charcoal/5 text-charcoal text-[10px] px-2 py-1 rounded-full font-bold">{items.length} {t('items')}</span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gold transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-400">
                            <div className="w-16 h-1 bg-charcoal/10 rounded-full"></div>
                            <p className="font-display text-charcoal/60">{t('soulWaiting')}</p>
                            <button onClick={onClose} className="text-gold text-sm hover:underline font-bold uppercase tracking-wide">{t('continueShopping')}</button>
                        </div>
                    ) : (
                        items.map((item) => {
                            const imageSrc = item.image || (item.images && item.images[0]) || '/images/ayodhya_logo.png';
                            const displayPrice = item.price || (item.numericPrice ? `₹${item.numericPrice}` : '₹299');
                            return (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-charcoal/5">
                                        <img src={imageSrc} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-heading text-charcoal text-lg">{item.name}</h4>
                                            <button
                                                onClick={() => onRemove(item.id)}
                                                className="text-gray-400 hover:text-terracotta transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-1">{displayPrice}</p>

                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="flex items-center border border-charcoal/10 rounded-md bg-white">
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, -1)}
                                                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-charcoal hover:bg-gray-100 font-bold active:bg-gray-200 transition-colors"
                                                aria-label="Decrease quantity"
                                            >
                                                -
                                            </button>
                                            <span className="px-3 text-charcoal font-mono text-sm border-x border-charcoal/10 min-w-[36px] text-center font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, 1)}
                                                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-charcoal hover:bg-gray-100 font-bold active:bg-gray-200 transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                </div>

                <div className="border-t border-charcoal/5 pt-6 mt-auto bg-ivory">
                    <div className="flex justify-between items-center mb-6">
                        <span className="font-display text-gray-500 uppercase tracking-widest text-xs">{t('totalEstimate')}</span>
                        <span className="font-heading text-2xl text-charcoal">₹{total}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={items.length === 0}
                        className="w-full btn-premium bg-charcoal text-white hover:bg-gold hover:text-white transition-colors py-4 font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {t('proceedToCheckout')}
                    </button>
                </div>
            </motion.div>
        </>
    );
};

export default Cart;
