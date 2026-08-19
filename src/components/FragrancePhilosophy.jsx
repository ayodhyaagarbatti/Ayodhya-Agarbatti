import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Wind, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FragrancePhilosophy = () => {
    const { t } = useTranslation();

    const pillars = [
        { icon: <Leaf strokeWidth={1} size={32} />, titleKey: 'phil1Title', descKey: 'phil1Desc' },
        { icon: <Droplets strokeWidth={1} size={32} />, titleKey: 'phil2Title', descKey: 'phil2Desc' },
        { icon: <Wind strokeWidth={1} size={32} />, titleKey: 'phil3Title', descKey: 'phil3Desc' },
        { icon: <Zap strokeWidth={1} size={32} />, titleKey: 'phil4Title', descKey: 'phil4Desc' },
    ];

    return (
        <section className="py-32 bg-ivory text-charcoal border-b border-gray-100 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 opacity-50 -z-10"></div>

            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <span className="font-heading text-xs uppercase tracking-[0.3em] text-gold mb-6 block">{t('ourFormulation')}</span>
                    <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
                        {t('scienceHeading1')} <span className="italic">{t('scienceHeading2')}</span>
                    </h2>
                    <p className="font-body text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
                        {t('scienceDesc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {pillars.map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -10 }}
                            className="bg-white p-10 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gold/20 transition-all duration-500 group"
                        >
                            <div className="text-charcoal mb-6 group-hover:text-gold transition-colors">{item.icon}</div>
                            <h3 className="font-serif text-xl mb-4">{t(item.titleKey)}</h3>
                            <p className="font-body text-sm text-gray-500 leading-relaxed">{t(item.descKey)}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FragrancePhilosophy;
