import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const HoroscopePromoBanner = () => {
    return (
        <section className="py-16 bg-charcoal border-y border-gold/10">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-charcoal to-rich-black border border-gold/20 rounded-2xl p-8 md:p-10">
                    <div className="text-center md:text-left">
                        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gold mb-3">
                            <Sparkles size={13} /> New · Vedic Astrology
                        </span>
                        <h3 className="font-serif text-2xl md:text-3xl text-ivory mb-2">
                            Discover Your Life's Path
                        </h3>
                        <p className="text-ivory/70 text-sm max-w-md">
                            Get your complete Janma Kundali horoscope from just ₹99 - computed instantly, delivered as a downloadable PDF.
                        </p>
                    </div>
                    <Link
                        to="/horoscope"
                        className="shrink-0 bg-gold text-charcoal px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-ivory transition-all flex items-center gap-2"
                    >
                        Get My Horoscope <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HoroscopePromoBanner;
