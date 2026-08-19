import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Wind, Sun, Moon, Brain, Heart, Sparkles, Zap } from 'lucide-react';
import SEO, { faqSchema } from '../components/SEO';

const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Ayodhya Agarbatti Journal - Alchemy of Scent & Soul",
    "description": "Explore the ancient pharmacopoeia of our ingredients. Where modern neurobiology meets Vedic wisdom. Deep dives into coffee, vanilla, lemon, and orange fragrances.",
    "url": "https://www.ayodhyaagarbatti.in/blog",
    "publisher": {
        "@type": "Organization",
        "name": "Ayodhya Agarbatti",
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.ayodhyaagarbatti.in/images/ayodhya_logo.png"
        }
    },
    "blogPosts": [
        {
            "@type": "BlogPosting",
            "headline": "Coffee: The Science & Spirit of Awakening",
            "description": "The aroma of roasted coffee stimulates the Reticular Activating System (RAS) in the brain, instantly sharpening focus. Coffee grounds the spirit to the Earth element.",
            "image": "https://www.ayodhyaagarbatti.in/images/espresso.png",
            "datePublished": "2026-07-25",
            "author": {
                "@type": "Person",
                "name": "Ayodhya Agarbatti"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Ayodhya Agarbatti"
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://www.ayodhyaagarbatti.in/blog#coffee"
            },
            "keywords": "coffee incense, focus fragrance, morning ritual incense, Ayodhya agarbatti coffee"
        },
        {
            "@type": "BlogPosting",
            "headline": "Vanilla: The Science & Spirit of Comfort",
            "description": "Vanilla contains vanillin, proven to reduce startle reflexes and lower blood pressure. A warm embrace for the inner child that heals emotional wounds.",
            "image": "https://www.ayodhyaagarbatti.in/images/vanilla.png",
            "datePublished": "2026-07-25",
            "author": {
                "@type": "Person",
                "name": "Ayodhya Agarbatti"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Ayodhya Agarbatti"
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://www.ayodhyaagarbatti.in/blog#vanilla"
            },
            "keywords": "vanilla incense, relaxation fragrance, sleep aid incense, stress relief agarbatti"
        },
        {
            "@type": "BlogPosting",
            "headline": "Lemon: The Science & Spirit of Clarity",
            "description": "Cold-pressed lemon oil is rich in limonene, a terpene that boosts serotonin and dopamine. Like a knife of light, Lemon cuts through stagnant energy.",
            "image": "https://www.ayodhyaagarbatti.in/images/lemon.png",
            "datePublished": "2026-07-25",
            "author": {
                "@type": "Person",
                "name": "Ayodhya Agarbatti"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Ayodhya Agarbatti"
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://www.ayodhyaagarbatti.in/blog#lemon"
            },
            "keywords": "lemon incense, purification fragrance, mood lifting incense, citrus agarbatti"
        },
        {
            "@type": "BlogPosting",
            "headline": "Orange: The Science & Spirit of Joy",
            "description": "Wild Orange essence is known as the Oil of Abundance. It reduces cortisol and fosters flow state. The scent of unbridled joy and creative inspiration.",
            "image": "https://www.ayodhyaagarbatti.in/images/orange.png",
            "datePublished": "2026-07-25",
            "author": {
                "@type": "Person",
                "name": "Ayodhya Agarbatti"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Ayodhya Agarbatti"
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://www.ayodhyaagarbatti.in/blog#orange"
            },
            "keywords": "orange incense, creativity fragrance, joy incense, wild orange agarbatti"
        }
    ]
};

const breadcrumbs = [
    { name: 'Home', url: 'https://www.ayodhyaagarbatti.in/' },
    { name: 'Journal', url: 'https://www.ayodhyaagarbatti.in/blog' }
];

const ParallaxSection = ({ index, title, subtitle, image, color, align = "left", science, spirit, chakra }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={ref} className="relative py-32 overflow-hidden border-b border-gray-100 last:border-0">
            {/* Background Watermark Number */}
            <div className={`absolute top-20 ${align === "right" ? "left-0 md:left-20" : "right-0 md:right-20"} text-[200px] md:text-[300px] font-serif font-black text-charcoal/[0.03] leading-none select-none z-0`}>
                0{index}
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className={`flex flex-col md:flex-row ${align === "right" ? "md:flex-row-reverse" : ""} gap-16 items-center`}>

                    {/* Visual Side */}
                    <div className="w-full md:w-1/2">
                        <div className="relative h-[600px] w-full overflow-hidden rounded-sm group">
                            <motion.div style={{ y }} className="absolute inset-0 h-[120%] w-full">
                                <img src={image} alt={title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000" />
                            </motion.div>
                            <div className="absolute inset-0 bg-charcoal/5 group-hover:bg-transparent transition-all duration-700"></div>

                            {/* Floating Badge */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className={`absolute bottom-8 ${align === "right" ? "left-8" : "right-8"} bg-white/90 backdrop-blur-md p-6 max-w-xs shadow-xl hidden md:block`}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Chakra Alignment</span>
                                <h4 className="font-serif text-xl text-charcoal">{chakra}</h4>
                            </motion.div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full md:w-1/2">
                        <motion.div style={{ opacity }}>
                            <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 ${color} bg-opacity-10 text-charcoal border border-current`}>
                                {subtitle}
                            </span>

                            <h2 className="font-heading text-5xl md:text-7xl text-charcoal mb-8 leading-[0.9]">{title}</h2>

                            <div className="grid gap-12">
                                {/* Science Block */}
                                <div className="border-l-2 border-gray-200 pl-8 relative">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-200"></div>
                                    <h3 className="font-heading text-lg flex items-center gap-3 mb-4 text-gray-400 uppercase tracking-widest text-xs">
                                        <Wind size={16} /> The Science
                                    </h3>
                                    <p className="font-body text-gray-600 text-lg leading-relaxed">{science}</p>
                                </div>

                                {/* Spirit Block */}
                                <div className={`border-l-2 pl-8 relative`} style={{ borderColor: 'var(--color-gold)' }}>
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gold"></div>
                                    <h3 className="font-heading text-lg flex items-center gap-3 mb-4 text-gold uppercase tracking-widest text-xs">
                                        <Sun size={16} /> The Spirit
                                    </h3>
                                    <p className="font-serif text-xl md:text-2xl text-charcoal italic leading-relaxed opacity-90">
                                        "{spirit}"
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

const Blog = () => {
    return (
        <div className="bg-ivory min-h-screen">
            <SEO
                title="The Journal | Ayodhya Agarbatti - Alchemy of Scent & Soul"
                description="Explore the ancient pharmacopoeia of our ingredients. Where modern neurobiology meets Vedic wisdom. Deep dives into coffee, vanilla, lemon, and orange sacred fragrances."
                keywords="Ayodhya Agarbatti blog, incense journal, fragrance alchemy, scent science, spiritual aromatherapy, Vedic wisdom, neurobiology of scent, coffee incense, vanilla incense, lemon incense, orange incense"
                canonical="https://www.ayodhyaagarbatti.in/blog"
                ogImage="https://www.ayodhyaagarbatti.in/images/ritual_bg.png"
                ogType="article"
                schema={articleSchema}
                breadcrumbs={breadcrumbs}
            />
            {/* Hero Section */}
            {/* Hero Section */}
            <header className="pt-40 pb-32 px-6 text-center bg-ivory text-charcoal relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-multiply"></div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto relative z-10"
                >
                    <span className="font-heading text-xs font-bold uppercase tracking-[0.4em] text-gold mb-8 block">The Journal</span>
                    <h1 className="font-heading text-6xl md:text-8xl mb-8 leading-tight">
                        Alchemy of <br /><span className="italic font-serif font-light text-charcoal/60">Scent & Soul</span>
                    </h1>
                    <p className="font-body text-xl text-charcoal/60 max-w-2xl mx-auto leading-relaxed font-light">
                        Explore the ancient pharmacopoeia of our ingredients.
                        Where modern neurobiology meets Vedic wisdom.
                    </p>
                </motion.div>
            </header>

            <div className="w-full bg-white">
                <ParallaxSection
                    index={1}
                    title="Coffee"
                    subtitle="Awakening • Earth"
                    chakra="Muladhara (Root)"
                    image="/images/espresso.png"
                    color="text-amber-900 border-amber-900"
                    science="The aroma of roasted coffee stimulates the Reticular Activating System (RAS) in the brain, instantly sharpening focus and dispelling mental fog without the jitters of caffeine ingestion."
                    spirit="Coffee grounds the spirit to the Earth element. It is the scent of the morning prayer—turning the act of waking up into a sacred ritual of presence."
                />

                <ParallaxSection
                    index={2}
                    title="Vanilla"
                    subtitle="Comfort • Water"
                    chakra="Svadhisthana (Sacral)"
                    image="/images/vanilla.png"
                    color="text-amber-500 border-amber-500"
                    align="right"
                    science="Vanilla contains vanillin, a compound proven to reduce startle reflexes and lower blood pressure. It signals safety to the limbic system, allowing the nervous system to switch from 'fight or flight' to 'rest and digest'."
                    spirit="A warm embrace for the inner child. Vanilla heals emotional wounds, invites gentleness into the home, and reminds us that there is sweetness in simply being."
                />

                <ParallaxSection
                    index={3}
                    title="Lemon"
                    subtitle="Clarity • Fire"
                    chakra="Manipura (Solar Plexus)"
                    image="/images/lemon.png"
                    color="text-yellow-600 border-yellow-600"
                    science="Cold-pressed lemon oil is rich in limonene, a terpene that boosts serotonin and dopamine levels. It acts as a powerful antiseptic for the air and a mood-lifter for the mind."
                    spirit="Like a knife of light, Lemon cuts through stagnant energy and energetic sludge. It creates a space of absolute clarity where truth can be spoken and heard."
                />

                <ParallaxSection
                    index={4}
                    title="Orange"
                    subtitle="Joy • Air"
                    chakra="Anahata (Heart)"
                    image="/images/orange.png"
                    color="text-orange-600 border-orange-600"
                    align="right"
                    science="Wild Orange essence is known as the 'Oil of Abundance'. It reduces cortisol levels and fosters a state of 'flow', making it ideal for creative work and social gatherings."
                    spirit="The scent of unbridled joy. It dissolves the rigidity of perfectionism and invites a playful, permissive energy that celebrates life in all its abundance."
                />
            </div>

            <section className="py-32 bg-ivory text-center px-6 border-t border-charcoal/5">
                <h2 className="font-heading text-4xl text-charcoal mb-8">Begin Your Ritual</h2>
                <button className="bg-charcoal text-white px-10 py-4 uppercase tracking-[0.2em] font-bold hover:bg-gold transition-colors">
                    Visit Apothecary
                </button>
            </section>

            {/* GEO/AEO Optimized FAQ Section for AI Search Engines */}
            <section id="blog-faq" className="py-24 bg-white border-t border-gray-100" aria-labelledby="blog-faq-heading">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <span className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-gold mb-4 block">Frequently Asked Questions</span>
                        <h2 id="blog-faq-heading" className="font-serif text-4xl md:text-5xl text-charcoal mb-6">
                            The Science & Spirit Behind Our Sacred Fragrances
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Deep answers to common questions about the neurobiology, Vedic wisdom, and botanical science behind each Ayodhya Agarbatti fragrance.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {/* FAQ 1 - Coffee */}
                        <article className="bg-ivory p-6 rounded-xl border border-gray-100 hover:border-amber-900/50 transition-colors group">
                            <div className="w-12 h-12 bg-amber-900/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-900/20 transition-colors">
                                <Brain size={24} className="text-amber-900" />
                            </div>
                            <h4 className="font-heading text-lg text-charcoal mb-2">How does Coffee incense improve focus?</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                The aroma of roasted coffee stimulates the Reticular Activating System (RAS) in the brainstem, which regulates arousal and attention. This neural pathway sharpens focus and dispels mental fog within minutes — without the jitters or crash of caffeine ingestion.
                            </p>
                        </article>

                        {/* FAQ 2 - Vanilla */}
                        <article className="bg-ivory p-6 rounded-xl border border-gray-100 hover:border-amber-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                                <Heart size={24} className="text-amber-500" />
                            </div>
                            <h4 className="font-heading text-lg text-charcoal mb-2">Why is Vanilla calming for sleep?</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Vanilla contains vanillin, a compound clinically proven to reduce startle reflexes and lower blood pressure. It signals safety to the limbic system, allowing the nervous system to switch from sympathetic 'fight or flight' to parasympathetic 'rest and digest' mode — ideal for pre-sleep rituals.
                            </p>
                        </article>

                        {/* FAQ 3 - Lemon */}
                        <article className="bg-ivory p-6 rounded-xl border border-gray-100 hover:border-yellow-600/50 transition-colors group">
                            <div className="w-12 h-12 bg-yellow-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-600/20 transition-colors">
                                <Sparkles size={24} className="text-yellow-600" />
                            </div>
                            <h4 className="font-heading text-lg text-charcoal mb-2">What makes Lemon incense purifying?</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Cold-pressed lemon oil is rich in limonene, a monoterpene with powerful antimicrobial and mood-elevating properties. Limonene boosts serotonin and dopamine while neutralizing airborne pathogens — scientifically cleansing both the air and the mind's energetic field.
                            </p>
                        </article>

                        {/* FAQ 4 - Orange */}
                        <article className="bg-ivory p-6 rounded-xl border border-gray-100 hover:border-orange-600/50 transition-colors group">
                            <div className="w-12 h-12 bg-orange-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600/20 transition-colors">
                                <Zap size={24} className="text-orange-600" />
                            </div>
                            <h4 className="font-heading text-lg text-charcoal mb-2">How does Orange incense boost creativity?</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Wild Orange essence reduces cortisol (stress hormone) levels and fosters alpha brainwave states associated with 'flow'. It dissolves perfectionism-driven rigidity, allowing permissive, playful energy — the neurological foundation of creative breakthrough and joyful expression.
                            </p>
                        </article>
                    </div>

                    {/* Additional GEO Content Block - The Vedic-Neuroscience Bridge */}
                    <div className="mt-16 max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-charcoal text-ivory p-8 md:p-12 rounded-2xl"
                        >
                            <h3 className="font-serif text-3xl md:text-4xl text-gold mb-6 text-center">
                                Where Vedic Wisdom Meets Modern Neuroscience
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base md:text-lg leading-relaxed">
                                <div className="space-y-4">
                                    <h4 className="font-heading text-sm uppercase tracking-widest text-gold mb-2">🧬 Neurobiology of Sacred Scent</h4>
                                    <p className="text-ivory/80">Each Ayodhya Agarbatti fragrance is engineered to target specific neural pathways: Coffee → RAS activation (focus), Vanilla → Limbic calming (sleep), Lemon → Serotonin/Dopamine boost (clarity), Orange → Cortisol reduction + Alpha waves (creativity). This is aroma as precision neuro-modulation.</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-heading text-sm uppercase tracking-widest text-gold mb-2">🕉️ Vedic Elemental Alignment</h4>
                                    <p className="text-ivory/80">Each fragrance maps to a Pancha Mahabhuta (five elements) and Chakra: Coffee → Prithvi (Earth) / Muladhara, Vanilla → Jala (Water) / Svadhisthana, Lemon → Agni (Fire) / Manipura, Orange → Vayu (Air) / Anahata. Ancient wisdom, validated by modern science.</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-heading text-sm uppercase tracking-widest text-gold mb-2">🌿 Botanical Integrity Guaranteed</h4>
                                    <p className="text-ivory/80">Zero synthetic binders, zero charcoal, zero phthalates. Only steam-distilled essential oils, sacred temple flower powder, pure Mysore sandalwood, and natural plant resins (Jigzat gum). Every stick is hand-rolled in Ayodhya by artisans preserving generational knowledge.</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-heading text-sm uppercase tracking-widest text-gold mb-2">🔬 Quality You Can Trust</h4>
                                    <p className="text-ivory/80">45-50 minute burn time per stick. 100% non-toxic, soot-free formulation. Third-party tested for purity. Free express shipping across India on orders above ₹999. 7-day replacement guarantee with zero-cost pickup.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Blog;
