import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t } = useTranslation();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 150]);

    return (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-charcoal">
            {/* Cinematic Background - Sacred Temple/Warm Smoke */}
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                style={{
                    y: y1,
                    backgroundImage: "url('/images/ritual_bg.png')",
                }}
                className="absolute inset-0 z-0 bg-cover bg-center opacity-60"
            >
                {/* Gradient Overlays for integration */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/80"></div>
                <div className="absolute inset-0 bg-black/30 mix-blend-overlay"></div>
            </motion.div>

            {/* Content Overlay */}
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-32 sm:pt-36 md:pt-40 pb-12">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <motion.span
                        initial={{ opacity: 0, letterSpacing: "0.5em" }}
                        animate={{ opacity: 1, letterSpacing: "0.2em" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="block font-heading text-[10px] md:text-xs uppercase text-gold/80 mb-6 font-bold tracking-[0.3em]"
                    >
                        {t('heroTagline')}
                    </motion.span>

                    <h1 className="font-heading text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-ivory mb-6 md:mb-8 leading-[0.9] drop-shadow-2xl">
                        <motion.span
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="block font-normal text-ivory/90 mb-2"
                        >
                            {t('heroTitle1')}
                        </motion.span>
                        <motion.span
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            className="block font-bold text-transparent bg-clip-text bg-gradient-to-b from-gold via-gold/80 to-gold/40 pb-2 md:pb-4 italic font-serif"
                        >
                            {t('heroTitle2')}
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="font-body text-ivory/70 text-base md:text-xl font-light tracking-wide max-w-xl mx-auto mb-8 md:mb-12 leading-relaxed px-2"
                    >
                        {t('heroSubtitle')} <br />
                        <span className="text-gold/90 font-serif italic">{t('heroSubtitleItalic')}</span>
                    </motion.p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto px-4">
                        <motion.button
                            onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="bg-gold text-charcoal w-full sm:w-auto px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:bg-ivory hover:text-charcoal transition-all duration-300 min-w-[180px]"
                        >
                            {t('heroShopBtn')}
                        </motion.button>

                        <motion.button
                            onClick={() => document.getElementById('ritual')?.scrollIntoView({ behavior: 'smooth' })}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="bg-transparent text-ivory w-full sm:w-auto px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold border border-white/20 hover:border-gold hover:text-gold transition-all duration-300 min-w-[180px] backdrop-blur-sm"
                        >
                            {t('heroRitualsBtn')}
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 text-ivory/30 flex flex-col items-center gap-2"
            >
                <div className="text-[9px] uppercase tracking-widest text-gold/60">{t('heroDiscover')}</div>
                <motion.div
                    animate={{ height: [40, 70, 40], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-[1px] bg-gradient-to-b from-gold to-transparent"
                ></motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
