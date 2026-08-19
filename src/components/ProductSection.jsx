import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Eye, Sparkles, Filter, CheckCircle, ShieldCheck, Flame } from 'lucide-react';
import { products, categories } from '../data/products';
import { useTranslation } from 'react-i18next';

const ProductSection = ({ addToCart, isStandaloneShop = false }) => {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState("All Incense");
    const [sortBy, setSortBy] = useState("featured");
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [addedToast, setAddedToast] = useState(null);

    const handleAddToCart = (product, e) => {
        if (e) e.stopPropagation();
        addToCart(product);
        setAddedToast(product.name);
        setTimeout(() => setAddedToast(null), 2500);
    };

    // Filtering & Sorting
    const filteredProducts = products.filter(product => {
        if (selectedCategory === "All Incense") return true;
        return product.category === selectedCategory;
    }).sort((a, b) => {
        if (sortBy === "price-low") return a.numericPrice - b.numericPrice;
        if (sortBy === "price-high") return b.numericPrice - a.numericPrice;
        if (sortBy === "rating") return b.rating - a.rating;
        return a.id - b.id;
    });

    return (
        <section className={`py-16 md:py-24 relative overflow-hidden ${isStandaloneShop ? 'bg-ivory text-charcoal pt-28 md:pt-36' : 'bg-transparent text-ivory'}`}>
            {/* Added to Cart Toast Notification - Mobile Centered Bottom */}
            <AnimatePresence>
                {addedToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 z-[120] bg-charcoal text-ivory border border-gold px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
                    >
                        <CheckCircle className="text-gold w-6 h-6 shrink-0" />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gold">{t('addedToSanctuary')}</p>
                            <p className="text-sm font-serif">{addedToast}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <span className="font-heading text-xs font-bold tracking-[0.3em] text-gold uppercase mb-3 block flex items-center gap-2">
                            <Sparkles size={14} /> {t('royalCollection')}
                        </span>
                        <h2 className={`font-serif text-4xl md:text-6xl leading-tight ${isStandaloneShop ? 'text-charcoal' : 'text-ivory'}`}>
                            {t('sacredFragrances')} <br />
                            <span className="italic font-light opacity-80">{t('handRolled')}</span>
                        </h2>
                    </div>

                    {/* Filter & Sort Controls */}
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                            <Filter size={14} className="text-gold" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-xs uppercase tracking-wider font-bold text-charcoal outline-none cursor-pointer"
                            >
                                <option value="featured" className="bg-charcoal text-white">{t('sortFeatured')}</option>
                                <option value="price-low" className="bg-charcoal text-white">{t('sortPriceLow')}</option>
                                <option value="price-high" className="bg-charcoal text-white">{t('sortPriceHigh')}</option>
                                <option value="rating" className="bg-charcoal text-white">{t('sortRating')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-3 overflow-x-auto pb-6 mb-10 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                                selectedCategory === cat
                                    ? 'bg-gold text-charcoal border-gold shadow-lg shadow-gold/20 scale-105'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-gold/50 hover:text-gold'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl hover:border-gold/40 transition-all duration-500 flex flex-col group text-charcoal"
                        >
                            {/* Image Container */}
                            <div className="relative h-[340px] overflow-hidden bg-gray-50">
                                {/* Badges */}
                                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                    <span className="bg-charcoal/90 text-gold backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow">
                                        {product.badge}
                                    </span>
                                    {product.discount && (
                                        <span className="bg-gold text-charcoal px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow">
                                            {product.discount}
                                        </span>
                                    )}
                                </div>

                                {/* Quick View Button Overlay */}
                                <button
                                    onClick={() => setQuickViewProduct(product)}
                                    aria-label={`Quick view ${product.name}`}
                                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-charcoal hover:bg-gold hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow"
                                >
                                    <Eye size={18} />
                                </button>

                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className={`w-full h-full object-cover transition-all duration-700 ease-out ${product.images[1] ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                                />
                                {product.images[1] && (
                                    <img
                                        src={product.images[1]}
                                        alt={`${product.name} lifestyle`}
                                        className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out scale-105 pointer-events-none"
                                    />
                                )}

                                {/* Burn time pill */}
                                <div className="absolute bottom-3 left-4 right-4 z-10 flex justify-between items-center bg-charcoal/80 backdrop-blur-md text-ivory px-4 py-2 rounded-lg text-[10px] font-semibold tracking-wider">
                                    <span className="flex items-center gap-1"><Flame size={12} className="text-gold" /> {product.burnTime}</span>
                                    <span>{product.stickCount.split('+')[0]}</span>
                                </div>
                            </div>

                            {/* Info Container */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded">
                                            {product.category}
                                        </span>
                                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                                            <Star size={14} className="fill-current" />
                                            <span>{product.rating}</span>
                                            <span className="text-gray-400 font-normal text-[10px]">({product.reviewCount})</span>
                                        </div>
                                    </div>

                                    <h3 className="font-serif text-2xl font-semibold mb-1 hover:text-gold transition-colors">
                                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-4">{product.variant}</p>

                                    <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-2">
                                        {product.shortDesc}
                                    </p>

                                    {/* Pyramid summary */}
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-[11px] mb-4 space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400 font-bold uppercase text-[9px]">{t('topNote')}</span>
                                            <span className="font-medium text-gray-700 truncate max-w-[180px]">{product.pyramid.top}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400 font-bold uppercase text-[9px]">{t('baseNote')}</span>
                                            <span className="font-medium text-gray-700 truncate max-w-[180px]">{product.pyramid.base}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price and Actions */}
                                <div>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="font-serif text-2xl font-bold text-charcoal">{product.price}</span>
                                        <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
                                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{t('taxIncluded')}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={(e) => handleAddToCart(product, e)}
                                            className="bg-charcoal text-white hover:bg-gold hover:text-charcoal font-bold uppercase tracking-widest text-[11px] py-3.5 px-4 rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                                        >
                                            <ShoppingBag size={14} /> {t('quickAdd')}
                                        </button>
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="border border-charcoal/20 text-charcoal hover:border-gold hover:text-gold font-bold uppercase tracking-widest text-[11px] py-3.5 px-4 rounded-lg transition-all text-center block"
                                        >
                                            {t('viewRitual')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Quick View Modal */}
            {quickViewProduct && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-white text-charcoal w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={() => setQuickViewProduct(null)}
                            className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-gray-100 hover:bg-gold hover:text-white flex items-center justify-center font-bold transition-colors"
                        >
                            ✕
                        </button>

                        <div className="w-full md:w-1/2 h-72 md:h-auto relative bg-gray-100">
                            <img src={quickViewProduct.images[0]} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full inline-block mb-3">
                                    {quickViewProduct.category}
                                </span>
                                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">{quickViewProduct.name}</h2>
                                <p className="text-sm text-gray-500 mb-4">{quickViewProduct.variant}</p>
                                <p className="font-serif text-2xl font-bold text-charcoal mb-4">
                                    {quickViewProduct.price} <span className="text-sm text-gray-400 line-through font-normal">{quickViewProduct.originalPrice}</span>
                                </p>

                                <p className="text-sm text-gray-600 leading-relaxed mb-6 border-l-2 border-gold pl-4 italic">
                                    "{quickViewProduct.story}"
                                </p>

                                <div className="space-y-2 mb-6">
                                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400">{t('fragrancePyramid')}</div>
                                    <div className="grid grid-cols-3 gap-2 text-xs bg-gray-50 p-3 rounded-lg">
                                        <div><span className="text-[9px] block text-gray-400">{t('pyramidTop')}</span> {quickViewProduct.pyramid.top}</div>
                                        <div><span className="text-[9px] block text-gray-400">{t('pyramidHeart')}</span> {quickViewProduct.pyramid.heart}</div>
                                        <div><span className="text-[9px] block text-gray-400">{t('pyramidBase')}</span> {quickViewProduct.pyramid.base}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        addToCart(quickViewProduct);
                                        setQuickViewProduct(null);
                                    }}
                                    className="flex-1 bg-charcoal text-white hover:bg-gold hover:text-charcoal py-4 font-bold uppercase tracking-widest text-xs rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag size={16} /> {t('addToSanctuary')} — {quickViewProduct.price}
                                </button>
                                <Link
                                    to={`/product/${quickViewProduct.id}`}
                                    onClick={() => setQuickViewProduct(null)}
                                    className="bg-gray-100 text-charcoal hover:bg-gray-200 py-4 px-6 font-bold uppercase tracking-widest text-xs rounded-lg transition-colors text-center"
                                >
                                    {t('fullDetails')}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </section>
    );
};

export default ProductSection;
