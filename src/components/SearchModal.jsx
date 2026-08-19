import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Star, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { logSearchQuery } from '../utils/analyticsLogger';

const SearchModal = ({ isOpen, onClose, addToCart }) => {
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!query || query.trim().length < 3) return;
        const timer = setTimeout(() => {
            logSearchQuery(query.trim(), filteredProducts.length);
        }, 1000);
        return () => clearTimeout(timer);
    }, [query]);

    if (!isOpen) return null;

    const filteredProducts = products.filter(product => {
        const matchesQuery = query === '' || 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.variant.toLowerCase().includes(query.toLowerCase()) ||
            product.benefits.some(b => b.toLowerCase().includes(query.toLowerCase())) ||
            product.shortDesc.toLowerCase().includes(query.toLowerCase());
        
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        
        return matchesQuery && matchesCategory;
    });

    const popularSearches = ["Focus", "Vanilla", "Chandan", "Lemon", "Sleep", "Gift Box"];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-md flex items-start justify-center pt-16 md:pt-24 px-4 overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, y: -20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: -20, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-ivory text-charcoal w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden border border-gold/30 my-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with input */}
                    <div className="p-6 border-b border-gray-200 relative flex items-center gap-4 bg-white">
                        <Search className="text-gold w-6 h-6 shrink-0" />
                        <input
                            type="text"
                            autoFocus
                            placeholder="Search fragrances by name, notes (e.g. Chandan, Coffee), benefits..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full text-lg md:text-xl font-serif bg-transparent outline-none text-charcoal placeholder-gray-400"
                        />
                        {query && (
                            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-charcoal text-xs uppercase font-bold px-2">
                                Clear
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gold transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Popular search tags */}
                    <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Popular:</span>
                        {popularSearches.map(term => (
                            <button
                                key={term}
                                onClick={() => setQuery(term)}
                                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-gold hover:text-gold transition-all"
                            >
                                {term}
                            </button>
                        ))}
                    </div>

                    {/* Product Results */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <Search className="w-12 h-12 mx-auto mb-3 text-gold/40" />
                                <p className="font-serif text-lg text-charcoal">No fragrances match "{query}"</p>
                                <p className="text-xs text-gray-500 mt-1">Try searching for Chandan, Vanilla, Focus, or Sleep.</p>
                            </div>
                        ) : (
                            filteredProducts.map(product => (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-4 p-4 rounded-lg bg-white border border-gray-100 hover:border-gold/40 hover:shadow-md transition-all group"
                                >
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-20 h-20 object-cover rounded-md shrink-0 bg-gray-50"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded">
                                                {product.category}
                                            </span>
                                            <div className="flex items-center text-amber-500 text-xs gap-1 font-bold">
                                                <Star className="w-3 h-3 fill-current" /> {product.rating}
                                            </div>
                                        </div>
                                        <h4 className="font-serif text-lg text-charcoal truncate group-hover:text-gold transition-colors">
                                            {product.name}
                                        </h4>
                                        <p className="text-xs text-gray-500 truncate">{product.variant}</p>
                                        <p className="text-xs font-bold text-charcoal mt-1">
                                            {product.price} <span className="text-gray-400 line-through text-[11px] font-normal">{product.originalPrice}</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-2 shrink-0">
                                        <button
                                            onClick={() => {
                                                addToCart(product);
                                                onClose();
                                            }}
                                            className="bg-charcoal text-ivory hover:bg-gold hover:text-white text-[10px] uppercase font-bold tracking-widest px-3 py-2.5 rounded transition-all flex items-center gap-1.5"
                                        >
                                            <ShoppingBag size={12} /> Add
                                        </button>
                                        <Link
                                            to={`/product/${product.id}`}
                                            onClick={onClose}
                                            className="bg-gray-100 hover:bg-gray-200 text-charcoal text-[10px] uppercase font-bold tracking-widest px-3 py-2.5 rounded transition-all flex items-center gap-1 text-center"
                                        >
                                            View <ArrowRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SearchModal;
