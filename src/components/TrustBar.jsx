import React from 'react';
import { Leaf, Award, Feather, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const TrustBar = () => {
    const { t } = useTranslation();

    const features = [
        { icon: <Leaf strokeWidth={1.5} />, titleKey: 'trust1Title', descKey: 'trust1Desc' },
        { icon: <Award strokeWidth={1.5} />, titleKey: 'trust2Title', descKey: 'trust2Desc' },
        { icon: <Feather strokeWidth={1.5} />, titleKey: 'trust3Title', descKey: 'trust3Desc' },
        { icon: <Droplets strokeWidth={1.5} />, titleKey: 'trust4Title', descKey: 'trust4Desc' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <section className="bg-white text-charcoal py-20 border-t border-charcoal/5 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gold/5 blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-12"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="flex flex-col items-center text-center group cursor-default"
                        >
                            <div className="mb-6 text-gold p-5 rounded-full border border-charcoal/10 bg-gray-50 group-hover:bg-gold group-hover:text-white group-hover:border-gold transition-all duration-500 shadow-sm group-hover:shadow-lg">
                                {React.cloneElement(feature.icon, { size: 28 })}
                            </div>
                            <h3 className="font-heading text-lg mb-2 text-charcoal font-semibold tracking-wide">{t(feature.titleKey)}</h3>
                            <p className="font-body text-xs text-gray-500 uppercase tracking-widest group-hover:text-gold transition-colors">{t(feature.descKey)}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TrustBar;
