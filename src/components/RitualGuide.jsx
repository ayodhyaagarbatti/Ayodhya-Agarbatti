import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const RitualGuide = () => {
    const { t } = useTranslation();

    return (
        <section className="py-32 bg-ivory text-charcoal relative overflow-hidden">
            <div className="absolute inset-0 bg-gold/5"></div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">

                {/* Text Content */}
                <div className="w-full md:w-1/2">
                    <span className="font-heading text-xs uppercase tracking-[0.3em] text-gold mb-6 block">{t('theExperience')}</span>
                    <h2 className="font-serif text-4xl md:text-6xl leading-tight mb-8">
                        {t('elevateHeading1')} <br /><span className="italic">{t('elevateHeading2')}</span>
                    </h2>
                    <p className="font-body text-charcoal/80 text-lg leading-relaxed mb-12">
                        {t('ritualDesc')}
                    </p>

                    <div className="space-y-8 border-l border-charcoal/10 pl-8">
                        <div>
                            <h4 className="font-heading text-xs uppercase tracking-widest text-charcoal mb-2">{t('step1Title')}</h4>
                            <p className="text-charcoal/60 text-sm">{t('step1Desc')}</p>
                        </div>
                        <div>
                            <h4 className="font-heading text-xs uppercase tracking-widest text-charcoal mb-2">{t('step2Title')}</h4>
                            <p className="text-charcoal/60 text-sm">{t('step2Desc')}</p>
                        </div>
                        <div>
                            <h4 className="font-heading text-xs uppercase tracking-widest text-charcoal mb-2">{t('step3Title')}</h4>
                            <p className="text-charcoal/60 text-sm">{t('step3Desc')}</p>
                        </div>
                    </div>
                </div>

                {/* Visual/Video Placeholder */}
                <div className="w-full md:w-1/2 h-[600px] relative">
                    <div className="absolute inset-0 border border-charcoal/10 p-4">
                        <div className="w-full h-full bg-gray-100 overflow-hidden relative">
                            <img
                                src="/images/ritual_moment.png"
                                alt="Ritual Moment"
                                className="w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-[2s]"
                            />
                            <div className="absolute bottom-8 left-8">
                                <p className="font-cursive text-3xl text-gold">pause.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RitualGuide;
