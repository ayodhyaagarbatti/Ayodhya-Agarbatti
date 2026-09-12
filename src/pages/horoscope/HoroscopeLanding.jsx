import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import SEO from '../../components/SEO';
import { horoscopeProducts } from '../../data/horoscopeProducts';
import ReferAndEarn from '../../components/ReferAndEarn';
import { storeReferralCode } from '../../utils/referral';
import { useRegion } from '../../hooks/useRegion';
import { formatHoroscopePrice } from '../../utils/currency';

const HoroscopeLanding = () => {
    const [searchParams] = useSearchParams();
    const { isIndia } = useRegion();

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) storeReferralCode(ref);
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-ivory/50 pt-32 pb-20">
            <SEO
                title="Most Accurate Horoscope Reading Online | Vedic Astrology - Ayodhya Agarbatti"
                description="Get the most accurate horoscope reading online - a Janma Kundali life horoscope for ₹99 or a full marriage compatibility match for ₹149, computed to arc-second precision from your exact birth details and delivered instantly as a branded PDF."
                keywords="most accurate horoscope reading, accurate horoscope online, Vedic horoscope, Janma Kundali, marriage compatibility match, birth chart online, kundli matching, Vedic astrology reading India"
                canonical="https://www.ayodhyaagarbatti.in/horoscope"
                ogType="website"
            />
            <div className="max-w-5xl mx-auto px-6 text-center mb-16">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-gold mb-4">
                    <Sparkles size={14} /> Vedic Astrology
                </span>
                <h1 className="font-serif text-4xl md:text-6xl text-charcoal mb-6">
                    Discover Your Life's Path
                </h1>
                <p className="font-body text-gray-600 max-w-2xl mx-auto text-lg">
                    A complete Vedic birth chart, computed to arc-second precision from your exact birth details - career, marriage, health, timing and remedies, delivered instantly as a shareable PDF.
                </p>
            </div>

            <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {horoscopeProducts.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all p-8 flex flex-col"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="font-heading text-xl text-charcoal">{product.name}</h2>
                                <p className="text-xs uppercase tracking-widest text-gold font-bold mt-1">{product.shortName}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="font-serif text-3xl font-bold text-charcoal">{formatHoroscopePrice(product, isIndia)}</div>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-6">{product.tagline}</p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            {product.includes.map((item) => (
                                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                                    <Check size={16} className="text-gold shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        {isIndia ? (
                            <Link
                                to={`/horoscope/${product.id}/details`}
                                className="btn-primary flex items-center justify-center gap-2 hover:bg-gold hover:text-charcoal"
                            >
                                Get Started <ArrowRight size={14} />
                            </Link>
                        ) : (
                            <Link
                                to="/contact"
                                className="btn-primary bg-gray-100 text-gray-500 flex items-center justify-center gap-2"
                            >
                                International Checkout Coming Soon
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-12">
                <ReferAndEarn />
            </div>

            <p className="text-center text-xs text-gray-400 max-w-xl mx-auto mt-12 px-6">
                Vedic astrology is a traditional interpretive system offered for reflection and cultural insight - not medical, legal or financial advice.
            </p>
        </div>
    );
};

export default HoroscopeLanding;
