import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Marquee = () => {
    const { t } = useTranslation();

    const items = [
        t('marquee1'), t('marquee2'), t('marquee3'), t('marquee4'), t('marquee5'),
        t('marquee1'), t('marquee2'), t('marquee3'), t('marquee4'), t('marquee5'),
    ];

    return (
        <div className="bg-ivory text-charcoal py-6 overflow-hidden flex whitespace-nowrap border-y border-charcoal/5 relative z-20">
            <motion.div
                className="flex gap-16 font-heading text-xs md:text-sm tracking-[0.3em] uppercase font-bold text-gray-400"
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            >
                {items.map((item, i) => (
                    <React.Fragment key={i}>
                        <span>{item}</span>
                        <span className="text-gold">•</span>
                    </React.Fragment>
                ))}
            </motion.div>
            <motion.div
                className="flex gap-16 font-heading text-xs md:text-sm tracking-[0.3em] uppercase font-bold ml-16 text-gray-400"
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            >
                {items.map((item, i) => (
                    <React.Fragment key={i}>
                        <span>{item}</span>
                        <span className="text-gold">•</span>
                    </React.Fragment>
                ))}
            </motion.div>
        </div>
    );
};

export default Marquee;
