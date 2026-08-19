import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, Flame, Sparkles, 
    Check, ShoppingBag, Info, Heart, Share2, HelpCircle, UserCheck,
    ChevronLeft, ChevronRight 
} from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import SEO, { breadcrumbSchema, faqSchema } from '../components/SEO';
import { products } from '../data/products';

const ProductDetails = ({ addToCart }) => {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id)) || products[0];

    const [selectedPack, setSelectedPack] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedImage, setSelectedImage] = useState(0);
    const [addedToast, setAddedToast] = useState(false);
    const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
    const [userReviews, setUserReviews] = useState(product.reviews || []);
    const [reviewSuccess, setReviewSuccess] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // Fetch product reviews live from Firestore database
        const q = query(collection(db, "reviews"), where("productId", "==", product.id));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const dbReviews = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Merge static default reviews with live database reviews
            setUserReviews([...dbReviews, ...(product.reviews || [])]);
        }, (err) => {
            console.error("Error fetching product reviews from database:", err);
        });

        return () => unsubscribe();
    }, [id, product.id]);

    const currentPrice = product.packOptions?.[selectedPack]?.price || product.numericPrice;
    const totalPrice = currentPrice * quantity;
    const canonicalUrl = `https://www.ayodhyaagarbatti.in/product/${product.id}`;

    const handleAddToCart = () => {
        const itemToAdd = {
            ...product,
            price: `₹${currentPrice}`,
            selectedPackName: product.packOptions?.[selectedPack]?.size || product.stickCount,
            quantity: quantity
        };
        addToCart(itemToAdd);
        setAddedToast(true);
        setTimeout(() => setAddedToast(false), 2500);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewForm.name || !reviewForm.comment) return;
        
        try {
            const newReview = {
                productId: product.id,
                productSlug: product.slug,
                productName: product.name,
                name: reviewForm.name,
                location: "Verified Purchaser",
                rating: reviewForm.rating,
                date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                comment: reviewForm.comment,
                createdAt: serverTimestamp()
            };
            
            await addDoc(collection(db, "reviews"), newReview);
            setReviewForm({ name: '', rating: 5, comment: '' });
            setReviewSuccess(true);
            setTimeout(() => setReviewSuccess(false), 3000);
        } catch (err) {
            console.error("Error saving review to database:", err);
            alert("Failed to save review to database. Please check your connection.");
        }
    };

    const breadcrumbs = [
        { name: 'Home', url: 'https://www.ayodhyaagarbatti.in/' },
        { name: 'Shop', url: 'https://www.ayodhyaagarbatti.in/shop' },
        { name: product.category, url: `https://www.ayodhyaagarbatti.in/shop?category=${encodeURIComponent(product.category)}` },
        { name: product.name, url: canonicalUrl }
    ];

    const productFaqs = product.faqs?.map(faq => ({
        question: faq.question,
        answer: faq.answer
    })) || [];

    const generalFaqs = [
        {
            question: "Are Ayodhya Agarbatti incense sticks charcoal-free?",
            answer: "Yes, all Ayodhya Agarbatti incense sticks are 100% charcoal-free. We use natural plant resins, sacred temple flower powder, and pure essential oils as binders instead of charcoal, ensuring a clean, non-toxic burn without black soot."
        },
        {
            question: "How long does each incense stick burn?",
            answer: "Each hand-rolled incense stick burns for approximately 45-50 minutes, providing long-lasting fragrance for your rituals, meditation, or daily use."
        },
        {
            question: "What ingredients are used in Ayodhya Agarbatti?",
            answer: "Our incense sticks contain 100% natural ingredients: sacred Ayodhya temple flower powder, pure Mysore sandalwood powder, natural tree gum (Jigzat resin), bamboo-free natural base, and therapeutic essential oils. Zero synthetic chemicals, phthalates, or charcoal."
        },
        {
            question: "Do you ship across India?",
            answer: "Yes, we offer fast express shipping across India. Free shipping on orders above ₹999. We also offer Cash on Delivery (COD) for most pin codes."
        },
        {
            question: "Can I return or exchange incense sticks?",
            answer: "We offer a 7-day replacement policy for damaged, defective, or incorrect items. Due to the consumable nature of incense, opened/burnt packs cannot be returned unless proven defective upon arrival. See our Return Policy page for full details."
        }
    ];

    const allFaqs = [...productFaqs, ...generalFaqs];

    const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "alternateName": product.variant,
        "image": product.images?.map(img => `https://www.ayodhyaagarbatti.in${img}`),
        "description": product.shortDesc,
        "sku": `AYD-${product.id.toString().padStart(3, '0')}`,
        "brand": {
            "@type": "Brand",
            "name": "Ayodhya Agarbatti",
            "logo": "https://www.ayodhyaagarbatti.in/images/ayodhya_logo.png"
        },
        "manufacturer": {
            "@type": "Organization",
            "name": "Ayodhya Agarbatti",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Ayodhya",
                "addressRegion": "Uttar Pradesh",
                "addressCountry": "IN"
            }
        },
        "category": "Incense Sticks",
        "material": "Natural temple flowers, sandalwood, essential oils, plant resins",
        "color": "Natural",
        "offers": product.packOptions?.map(pack => ({
            "@type": "Offer",
            "url": canonicalUrl,
            "priceCurrency": "INR",
            "price": pack.price.toString(),
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "name": pack.size,
            "description": pack.tag || '',
            "seller": {
                "@type": "Organization",
                "name": "Ayodhya Agarbatti"
            },
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                    "@type": "MonetaryAmount",
                    "value": "0",
                    "currency": "INR"
                },
                "shippingDestination": {
                    "@type": "DefinedRegion",
                    "addressCountry": "IN"
                },
                "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "handlingTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 1,
                        "maxValue": 2,
                        "unitCode": "DAY"
                    },
                    "transitTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 2,
                        "maxValue": 5,
                        "unitCode": "DAY"
                    }
                }
            },
            "priceValidUntil": "2026-12-31"
        })) || [{
            "@type": "Offer",
            "url": canonicalUrl,
            "priceCurrency": "INR",
            "price": product.numericPrice.toString(),
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
                "@type": "Organization",
                "name": "Ayodhya Agarbatti"
            }
        }],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.rating || 4.9,
            "reviewCount": userReviews.length || product.reviewCount || 164,
            "bestRating": "5",
            "worstRating": "1"
        },
        "review": userReviews.slice(0, 5).map(review => ({
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": review.name
            },
            "datePublished": review.date ? new Date(review.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            "reviewBody": review.comment,
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating,
                "bestRating": "5",
                "worstRating": "1"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Ayodhya Agarbatti"
            }
        })),
        "additionalProperty": [
            {
                "@type": "PropertyValue",
                "name": "Burn Time",
                "value": product.burnTime
            },
            {
                "@type": "PropertyValue",
                "name": "Stick Count",
                "value": product.stickCount
            },
            {
                "@type": "PropertyValue",
                "name": "Scent Strength",
                "value": `${product.scentStrength}/5`
            },
            {
                "@type": "PropertyValue",
                "name": "Charcoal Free",
                "value": "Yes"
            },
            {
                "@type": "PropertyValue",
                "name": "Hand Rolled",
                "value": "Yes"
            },
            {
                "@type": "PropertyValue",
                "name": "Origin",
                "value": "Ayodhya, Uttar Pradesh, India"
            }
        ]
    };

    return (
        <div className="bg-ivory text-charcoal min-h-screen pt-32 pb-24 relative">
            <SEO
                title={`${product.name} | Ayodhya Agarbatti (₹${product.numericPrice})`}
                description={product.shortDesc}
                keywords={`${product.name}, ${product.variant}, ${product.category}, Ayodhya Agarbatti, natural incense sticks, charcoal free agarbatti, temple flower incense, buy agarbatti online India, Mysore sandalwood incense`}
                canonical={canonicalUrl}
                ogImage={product.images?.[0] ? `https://www.ayodhyaagarbatti.in${product.images[0]}` : undefined}
                ogType="product"
                schema={productSchema}
                breadcrumbs={breadcrumbs}
                faqs={allFaqs}
            />
            {/* Added Toast - Mobile Centered Bottom */}
            <AnimatePresence>
                {addedToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 z-[120] bg-charcoal text-ivory border border-gold px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
                    >
                        <Check className="text-gold w-6 h-6 shrink-0" />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gold">Added to Sanctuary Bag</p>
                            <p className="text-sm font-serif">{quantity}x {product.name} ({product.packOptions?.[selectedPack]?.size || 'Standard'})</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 md:px-6">
                {/* Navigation Breadcrumb */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs uppercase tracking-widest text-gray-500 mb-6 sm:mb-8 font-bold">
                    <Link to="/shop" className="hover:text-gold transition-colors flex items-center gap-1">
                        <ArrowLeft size={14} /> Back to Collection
                    </Link>
                    <span>/</span>
                    <span className="text-gold">{product.category}</span>
                    <span className="hidden sm:inline">/</span>
                    <span className="text-charcoal font-semibold hidden sm:inline">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                    {/* Left Column: Image Gallery with Sliding Photos (6 cols) */}
                    <div className="lg:col-span-6 space-y-4">
                        <div className="relative h-[360px] sm:h-[480px] md:h-[580px] rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-xl group">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={selectedImage}
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ duration: 0.3 }}
                                    src={product.images[selectedImage] || product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                <span className="bg-charcoal text-gold px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest shadow">
                                    {product.badge}
                                </span>
                                {product.discount && (
                                    <span className="bg-gold text-charcoal px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest shadow">
                                        {product.discount}
                                    </span>
                                )}
                            </div>

                            {/* Slider Controls (Previous / Next Arrows) */}
                            {product.images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
                                        }}
                                        aria-label="Previous photo"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-gold hover:text-white backdrop-blur-md flex items-center justify-center text-charcoal transition-all shadow-lg border border-gray-200"
                                    >
                                        <ChevronLeft size={22} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
                                        }}
                                        aria-label="Next photo"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-gold hover:text-white backdrop-blur-md flex items-center justify-center text-charcoal transition-all shadow-lg border border-gray-200"
                                    >
                                        <ChevronRight size={22} />
                                    </button>
                                </>
                            )}

                            {/* Slide Dots Indicator */}
                            {product.images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                                    {product.images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedImage(idx);
                                            }}
                                            className={`h-2.5 rounded-full transition-all ${
                                                selectedImage === idx ? 'w-8 bg-gold' : 'w-2.5 bg-white/70 hover:bg-white'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sliding Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-2 gap-4">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedImage(idx);
                                        }}
                                        className={`p-3 rounded-xl border-2 transition-all bg-white flex items-center gap-3 ${
                                            selectedImage === idx ? 'border-gold shadow-md' : 'border-gray-200 opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-gold block">
                                                {idx === 0 ? 'Photo 1 (Packet)' : 'Photo 2 (Blend)'}
                                            </span>
                                            <span className="text-xs font-semibold text-charcoal">
                                                {idx === 0 ? 'Incense Pack' : 'Botanical Scene'}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Quick Specs Bar */}
                        <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Burn Duration</span>
                                <span className="font-serif font-bold text-sm text-charcoal">{product.burnTime}</span>
                            </div>
                            <div className="border-x border-gray-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Scent Strength</span>
                                <span className="font-serif font-bold text-sm text-gold">5 / 5 ★★★★★</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Formulation</span>
                                <span className="font-serif font-bold text-sm text-charcoal">100% Charcoal-Free</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Buying Console (6 cols) */}
                    <div className="lg:col-span-6 space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full">
                                    {product.category}
                                </span>
                                <div className="flex items-center text-amber-500 font-bold text-sm gap-1">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span>{product.rating}</span>
                                    <span className="text-gray-400 font-normal text-xs">({userReviews.length} verified reviews)</span>
                                </div>
                            </div>

                            <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-2 text-charcoal">
                                {product.name}
                            </h1>
                            <p className="text-sm text-gray-500 font-medium mb-4">{product.variant}</p>

                            <div className="flex items-baseline gap-3 mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-fit">
                                <span className="font-serif text-3xl font-bold text-charcoal">₹{currentPrice}</span>
                                <span className="text-base text-gray-400 line-through">{product.originalPrice}</span>
                                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded">
                                    Free Shipping Above ₹999
                                </span>
                            </div>

                            <p className="text-base text-gray-600 leading-relaxed border-l-2 border-gold pl-4 py-1 mb-6 italic">
                                "{product.shortDesc}"
                            </p>
                        </div>

                        {/* Pack Selection */}
                        {product.packOptions && (
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                                    Select Pack Option
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {product.packOptions.map((pack, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedPack(idx);
                                            }}
                                            className={`p-4 rounded-xl text-left border-2 transition-all flex flex-col justify-between ${
                                                selectedPack === idx
                                                    ? 'border-gold bg-gold/10 shadow-md'
                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                            }`}
                                        >
                                            <span className="text-xs font-bold text-charcoal block mb-1">{pack.size}</span>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="font-serif font-bold text-lg">₹{pack.price}</span>
                                                {pack.tag && (
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-gold bg-charcoal px-2 py-0.5 rounded">
                                                        {pack.tag}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Counter & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white p-1 shrink-0 w-fit">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 flex items-center justify-center font-bold text-lg text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center font-mono font-bold text-lg">{quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 flex items-center justify-center font-bold text-lg text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="flex-1 bg-charcoal text-white hover:bg-gold hover:text-charcoal transition-all py-4 px-8 rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-3 transform active:scale-98"
                            >
                                <ShoppingBag size={18} /> Add to Sanctuary — ₹{totalPrice}
                            </button>
                        </div>

                        {/* Key Benefits List */}
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Key Benefits & Attributes</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-700">
                                {product.benefits.map((b, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Sparkles size={12} className="text-gold shrink-0" />
                                        <span>{b}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Guarantees Bar */}
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 opacity-80 text-xs">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={20} className="text-gold shrink-0" />
                                <span className="font-semibold text-[11px]">100% Non-Toxic</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Truck size={20} className="text-gold shrink-0" />
                                <span className="font-semibold text-[11px]">Fast Express Shipping</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <RotateCcw size={20} className="text-gold shrink-0" />
                                <span className="font-semibold text-[11px]">Easy Replacement</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Tabs Section: Overview, Fragrance Profile, Ingredients, How to Burn, Reviews */}
                <div className="mt-20 border-t border-gray-200 pt-12">
                    <div className="flex items-center justify-start gap-4 border-b border-gray-200 overflow-x-auto pb-4 mb-8">
                        {[
                            { id: 'overview', label: 'Sacred Story' },
                            { id: 'profile', label: 'Fragrance Pyramid' },
                            { id: 'ingredients', label: 'Pure Ingredients' },
                            { id: 'reviews', label: `Reviews (${userReviews.length})` },
                            { id: 'faqs', label: 'FAQs' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActiveTab(tab.id);
                                }}
                                className={`px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'bg-charcoal text-gold shadow-md'
                                        : 'text-gray-500 hover:text-charcoal hover:bg-gray-100'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
                        {activeTab === 'overview' && (
                            <div className="space-y-6 max-w-3xl">
                                <span className="text-xs font-bold uppercase tracking-widest text-gold">{product.origin}</span>
                                <h3 className="font-serif text-3xl font-bold">{product.name} — Heritage & Philosophy</h3>
                                <p className="text-gray-600 text-lg leading-relaxed">{product.story}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Target Mood</h4>
                                        <p className="font-serif text-xl font-semibold italic text-charcoal">{product.mood}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Chakra Alignment</h4>
                                        <p className="font-serif text-xl font-semibold italic text-charcoal">{product.chakra}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="space-y-8">
                                <h3 className="font-serif text-3xl font-bold">Fragrance Architecture</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 bg-ivory rounded-xl border border-gray-200">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gold block mb-2">Top Note (0-15 mins)</span>
                                        <p className="font-serif text-xl font-bold">{product.pyramid.top}</p>
                                        <p className="text-xs text-gray-500 mt-2">The initial aromatic spark that lifts energy instantly upon lighting.</p>
                                    </div>
                                    <div className="p-6 bg-ivory rounded-xl border border-gray-200">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gold block mb-2">Heart Note (15-40 mins)</span>
                                        <p className="font-serif text-xl font-bold">{product.pyramid.heart}</p>
                                        <p className="text-xs text-gray-500 mt-2">The soulful core of the fragrance that permeates the sanctuary.</p>
                                    </div>
                                    <div className="p-6 bg-ivory rounded-xl border border-gray-200">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gold block mb-2">Base Note (Residual Lingering)</span>
                                        <p className="font-serif text-xl font-bold">{product.pyramid.base}</p>
                                        <p className="text-xs text-gray-500 mt-2">Deep botanical fixatives that remain gracefully in the air for hours.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ingredients' && (
                            <div className="space-y-6">
                                <h3 className="font-serif text-3xl font-bold">100% Pure & Natural Botanicals</h3>
                                <p className="text-gray-600">We refuse synthetic chemicals, artificial phthalates, and dark coal additives. Every ingredient is ethically harvested.</p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                    {product.ingredients.map((ing, idx) => (
                                        <li key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl text-sm font-semibold">
                                            <Check className="text-gold shrink-0" />
                                            <span>{ing}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h3 className="font-serif text-3xl font-bold">Customer Reviews</h3>
                                        <p className="text-xs text-gray-500 mt-1">Verified purchaser feedback from across India.</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
                                        <Star className="text-amber-500 fill-current w-5 h-5" />
                                        <span className="font-bold text-lg text-charcoal">{product.rating} out of 5</span>
                                    </div>
                                </div>

                                {/* Review List */}
                                <div className="space-y-4">
                                    {userReviews.map((rev) => (
                                        <div key={rev.id} className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-sm flex items-center gap-2">
                                                        {rev.name} <UserCheck size={14} className="text-green-600" />
                                                    </h4>
                                                    <span className="text-[10px] text-gray-400">{rev.location} • {rev.date}</span>
                                                </div>
                                                <div className="flex text-amber-500">
                                                    {[...Array(rev.rating)].map((_, i) => (
                                                        <Star key={i} size={14} className="fill-current" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed font-serif italic">"{rev.comment}"</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Write a Review Form */}
                                <div className="pt-8 border-t border-gray-200">
                                    <h4 className="font-serif text-2xl font-bold mb-4">Leave a Review</h4>
                                    {reviewSuccess && (
                                        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-bold mb-4">
                                            Thank you! Your review has been recorded.
                                        </div>
                                    )}
                                    <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                required
                                                placeholder="Your Name"
                                                value={reviewForm.name}
                                                onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                                                className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-gold"
                                            />
                                            <select
                                                value={reviewForm.rating}
                                                onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                                                className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-gold"
                                            >
                                                <option value={5}>5 Stars — Excellent</option>
                                                <option value={4}>4 Stars — Good</option>
                                                <option value={3}>3 Stars — Average</option>
                                            </select>
                                        </div>
                                        <textarea
                                            required
                                            rows={3}
                                            placeholder="Write your review experience..."
                                            value={reviewForm.comment}
                                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-gold"
                                        ></textarea>
                                        <button type="submit" className="bg-charcoal text-white hover:bg-gold hover:text-charcoal px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">
                                            Submit Review
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === 'faqs' && (
                            <div className="space-y-6 max-w-3xl">
                                <h3 className="font-serif text-3xl font-bold">Frequently Asked Questions</h3>
                                <div className="space-y-4">
                                    {product.faqs?.map((faq, i) => (
                                        <div key={i} className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                                            <h4 className="font-bold text-sm text-charcoal mb-2 flex items-center gap-2">
                                                <HelpCircle size={16} className="text-gold" /> {faq.question}
                                            </h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products Section */}
                <div className="mt-24">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-gold">Complete Your Sanctuary</span>
                            <h3 className="font-serif text-3xl font-bold">Recommended Fragrances</h3>
                        </div>
                        <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-gold hover:underline">
                            View All →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedProducts.map((rel) => (
                            <div key={rel.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all p-4">
                                <img src={rel.images[0]} alt={rel.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                                <h4 className="font-serif font-bold text-xl mb-1">{rel.name}</h4>
                                <p className="text-xs text-gray-500 mb-3">{rel.variant}</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-serif font-bold text-lg">{rel.price}</span>
                                    <Link to={`/product/${rel.id}`} className="text-xs font-bold uppercase tracking-widest text-gold hover:text-charcoal">
                                        Discover →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetails;
