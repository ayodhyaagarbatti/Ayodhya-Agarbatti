import React from 'react';
import Hero from '../components/Hero';
import ProductSection from '../components/ProductSection';
import Marquee from '../components/Marquee';
import TrustBar from '../components/TrustBar';
import ScrollReveal from '../components/ScrollReveal';
import FragrancePhilosophy from '../components/FragrancePhilosophy';
import RitualGuide from '../components/RitualGuide';
import HoroscopePromoBanner from '../components/HoroscopePromoBanner';
import { Truck, Phone, ShieldCheck, RotateCcw, Leaf, Sparkles, Award, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Ayodhya Agarbatti - Best Agarbatti Online, Pure Sacred Incense Sticks Hand-Rolled in Ayodhya",
    "description": "Shop the best agarbatti online - 100% natural, charcoal-free premium incense sticks hand-rolled in the holy city of Ayodhya. Sourced from organic temple flowers, pure Mysore sandalwood, and therapeutic essential oils. Free shipping on orders above ₹500.",
    "url": "https://www.ayodhyaagarbatti.in/",
    "publisher": {
        "@type": "Organization",
        "name": "Ayodhya Agarbatti",
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.ayodhyaagarbatti.in/images/ayodhya_logo.png"
        }
    },
    "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "item": {
                    "@type": "Product",
                    "name": "Espresso Ground Incense",
                    "description": "Coffee & Dark Cocoa blend for focus & energy"
                }
            },
            {
                "@type": "ListItem",
                "position": 2,
                "item": {
                    "@type": "Product",
                    "name": "Madagascan Calm Incense",
                    "description": "Vanilla & Tonka Bean for relaxation & sleep"
                }
            },
            {
                "@type": "ListItem",
                "position": 3,
                "item": {
                    "@type": "Product",
                    "name": "Citrus Clarity Incense",
                    "description": "Lemon & Verbena for purification & cleansing"
                }
            },
            {
                "@type": "ListItem",
                "position": 4,
                "item": {
                    "@type": "Product",
                    "name": "Creative Spark Incense",
                    "description": "Wild Orange & Tulsi for joy & creative flow"
                }
            }
        ]
    },
    "about": "https://www.ayodhyaagarbatti.in/#heritage",
    "significantLink": [
        { "@type": "URL", "url": "https://www.ayodhyaagarbatti.in/shop", "name": "Shop Collection" },
        { "@type": "URL", "url": "https://www.ayodhyaagarbatti.in/blog", "name": "The Journal" },
        { "@type": "URL", "url": "https://www.ayodhyaagarbatti.in/contact", "name": "Contact Us" }
    ]
};

const breadcrumbs = [
    { name: 'Home', url: 'https://www.ayodhyaagarbatti.in/' }
];

const RitualSection = () => {
    const { t } = useTranslation();
    return (
    <div className="relative w-full h-[80vh] bg-fixed bg-center bg-cover flex items-center justify-center isolate"
        style={{ backgroundImage: "url('/images/ritual_bg.png')" }}>
        <div className="absolute inset-0 bg-ivory/80 z-[-1]"></div>
        <div className="text-center text-charcoal px-6 max-w-3xl">
            <ScrollReveal>
                <span className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-gold mb-6 block">{t('theRitual')}</span>
                <h2 className="font-serif text-5xl md:text-7xl font-light mb-8 leading-tight">
                    {t('ritualHeading1')} <br /> <span className="italic">{t('ritualHeading2')}</span>
                </h2>
                <p className="font-body text-lg md:text-xl text-charcoal/80 font-light leading-relaxed">
                    {t('ritualQuote')}
                </p>
            </ScrollReveal>
        </div>
    </div>
);
};

const Home = ({ addToCart }) => {
    const { t } = useTranslation();
    return (
        <div className="overflow-x-hidden">
            <SEO
                title="Ayodhya Agarbatti | Best Agarbatti Online - Pure Sacred Incense Sticks"
                description="Shop the best agarbatti online from Ayodhya - 100% natural, charcoal-free incense sticks hand-rolled with organic temple flowers and pure Mysore sandalwood. Free shipping on orders above ₹500. Also home to India's most accurate Vedic horoscope reading, computed instantly from your exact birth details."
                keywords="best agarbatti, best agarbatti online, Ayodhya Agarbatti, natural incense sticks, charcoal free agarbatti, Mysore sandalwood incense, temple flower agarbatti, organic incense sticks India, luxury agarbatti, pooja incense, Ayodhya incense online buy, buy agarbatti online, hand rolled incense, non toxic incense, premium incense India, accurate horoscope reading"
                canonical="https://www.ayodhyaagarbatti.in/"
                ogImage="https://www.ayodhyaagarbatti.in/images/ayodhya_package.png"
                schema={homeSchema}
                breadcrumbs={breadcrumbs}
            />
            <Hero />
            <TrustBar />
            <Marquee />

            <HoroscopePromoBanner />

            <section id="heritage" className="py-24 bg-ivory text-center px-6 border-b border-gray-100">
                <ScrollReveal width="100%">
                    <h2 className="font-heading text-xs uppercase tracking-[0.3em] text-gold mb-4">{t('ourHeritage')}</h2>
                    <p className="font-serif text-2xl md:text-3xl text-charcoal max-w-3xl mx-auto leading-relaxed italic">
                        {t('heritageQuote')}
                    </p>
                </ScrollReveal>
            </section>

            <RitualSection />

            <div id="ritual">
                <RitualGuide />
            </div>

            <div id="philosophy">
                <FragrancePhilosophy />
            </div>

            <div id="shop">
                <ProductSection addToCart={addToCart} />
            </div>

            {/* GEO/AEO Optimized FAQ Section for AI Search Engines */}
            <section id="faq" className="py-24 bg-white border-t border-gray-100" aria-labelledby="faq-heading">
                <div className="container mx-auto px-6">
                    <ScrollReveal width="100%">
                        <h2 id="faq-heading" className="font-heading text-xs uppercase tracking-[0.3em] text-gold mb-4">Frequently Asked Questions</h2>
                        <h3 className="font-serif text-4xl md:text-5xl text-charcoal mb-12 max-w-3xl mx-auto">
                            Everything You Need to Know About Our Sacred Incense
                        </h3>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {/* FAQ 1 */}
                        <article className="bg-ivory p-6 rounded-xl border border-gray-100 hover:border-gold/50 transition-colors">
                            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                                <Leaf size={24} className="text-gold" />
                            </div>
                            <h4 className="font-heading text-lg text-charcoal mb-2">Are your incense sticks 100% charcoal-free?</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Yes. All Ayodhya Agarbatti sticks are completely charcoal-free. We use natural plant resins (Jigzat gum), sacred temple flower powder, and pure Mysore sandalwood as binders. No charcoal, no black soot, no toxic fumes — just clean, sacred fragrance.
                            </p>
                        </article>

                        {/* FAQ 2 */}
                        <article className="bg-ivory p-6 rounded-xl border border-gray-100 hover:border-gold/50 transition-colors">
                            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                                <Sparkles size={24} className="text-gold" />
                            </div>
                            <h4 className="font-heading text-lg text-charcoal mb-2">What makes Ayodhya Agarbatti different from regular incense?</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                Hand-rolled in the holy city of Ayodhya using organic temple flowers, therapeutic essential oils, and traditional Vedic formulations. Each stick burns 45-50 minutes with zero synthetic chemicals, phthalates, or artificial fragrances.
                            </p>
                        </article>

                        {/* FAQ 3 */}
                        <article className="bg-ivory p-6 rounded-xl border border-gray-100 hover:border-gold/50 transition-colors">
                            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                                <Award size={24} className="text-gold" />
                            </div>
                            <h4 className="font-heading text-lg text-charcoal mb-2">Do you offer free shipping across India?</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Yes! Free express shipping on all orders above ₹500. We also offer Cash on Delivery (COD) for most pin codes. Orders typically deliver within 3-5 business days with zero-cost pickup for returns.
                            </p>
                        </article>

                        {/* FAQ 4 */}
                        <article className="bg-ivory p-6 rounded-xl border border-gray-100 hover:border-gold/50 transition-colors">
                            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                                <Shield size={24} className="text-gold" />
                            </div>
                            <h4 className="font-heading text-lg text-charcoal mb-2">What is your return & replacement policy?</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                7-day hassle-free replacement for damaged, defective, or incorrect items. We arrange free reverse pickup. Due to the consumable nature of incense, opened packs cannot be returned unless proven defective upon arrival.
                            </p>
                        </article>
                    </div>

                    {/* Additional GEO Content Block */}
                    <div className="mt-16 max-w-4xl mx-auto">
                        <ScrollReveal width="100%">
                            <div className="bg-charcoal text-ivory p-8 md:p-12 rounded-2xl">
                                <h3 className="font-serif text-3xl md:text-4xl text-gold mb-6 text-center">
                                    Why Choose Ayodhya Agarbatti for Your Sacred Space?
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base leading-relaxed">
                                    <div>
                                        <h4 className="font-heading text-sm uppercase tracking-widest text-gold mb-3">🕉️ Temple-Grade Authenticity</h4>
                                        <p className="text-ivory/80">Sourced directly from Ayodhya temple flowers and blessed in the holy city. Every stick carries the vibrational energy of sacred rituals performed for generations.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-heading text-sm uppercase tracking-widest text-gold mb-3">🌿 100% Natural & Non-Toxic</h4>
                                        <p className="text-ivory/80">Zero charcoal, zero synthetic binders, zero phthalates. Pure plant resins, sandalwood, essential oils, and sacred botanicals — safe for daily use around children, pets, and elders.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-heading text-sm uppercase tracking-widest text-gold mb-3">🧬 Science-Backed Fragrance Design</h4>
                                        <p className="text-ivory/80">Each fragrance engineered using neurobiology: Coffee for RAS activation (focus), Vanilla for limbic calming (sleep), Lemon for serotonin boost (clarity), Orange for cortisol reduction (creativity).</p>
                                    </div>
                                    <div>
                                        <h4 className="font-heading text-sm uppercase tracking-widest text-gold mb-3">🤝 Ethical & Sustainable</h4>
                                        <p className="text-ivory/80">Fair trade practices supporting local Ayodhya artisans. Eco-friendly packaging, bamboo-free sticks, and sustainable harvesting of all botanical ingredients.</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Trust Signals & Social Proof for Conversion & SEO */}
            <section className="py-16 bg-ivory border-t border-gray-100" aria-labelledby="trust-heading">
                <div className="container mx-auto px-6 text-center">
                    <ScrollReveal width="100%">
                        <h2 id="trust-heading" className="font-heading text-xs uppercase tracking-[0.3em] text-gold mb-4">Trusted by Devotees Across India</h2>
                        <h3 className="font-serif text-3xl md:text-4xl text-charcoal mb-8">
                            10,000+ Sacred Spaces Transformed
                        </h3>
                    </ScrollReveal>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        <div className="bg-white p-6 rounded-xl border border-gray-100">
                            <div className="font-serif text-4xl font-bold text-gold mb-1">10,000+</div>
                            <div className="text-sm text-gray-600">Happy Customers</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100">
                            <div className="font-serif text-4xl font-bold text-gold mb-1">4.9/5</div>
                            <div className="text-sm text-gray-600">Average Rating</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100">
                            <div className="font-serif text-4xl font-bold text-gold mb-1">100%</div>
                            <div className="text-sm text-gray-600">Charcoal-Free</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100">
                            <div className="font-serif text-4xl font-bold text-gold mb-1">3-5</div>
                            <div className="text-sm text-gray-600">Days Delivery</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
