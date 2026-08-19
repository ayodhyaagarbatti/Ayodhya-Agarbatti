import React, { useMemo, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Download, ArrowLeft } from 'lucide-react';
import SEO from '../../components/SEO';
import { buildHoroscopeEngineUrl } from '../../utils/horoscopeChartEncode';

const HoroscopeResult = () => {
    const location = useLocation();
    const { subject, partner, product } = location.state || {};
    const iframeRef = useRef(null);

    const engineUrl = useMemo(() => (subject ? buildHoroscopeEngineUrl(subject, partner) : null), [subject, partner]);

    if (!subject || !engineUrl) {
        return (
            <div className="min-h-screen pt-32 text-center bg-gray-50 flex flex-col items-center justify-center px-6">
                <h2 className="text-2xl font-heading mb-4 text-charcoal">No reading to show yet.</h2>
                <Link to="/horoscope" className="btn-primary bg-charcoal text-white hover:bg-gold hover:text-charcoal">View readings</Link>
            </div>
        );
    }

    const downloadPdf = () => {
        iframeRef.current?.contentWindow?.print();
    };

    return (
        <div className="min-h-screen bg-ivory/50 pt-24 pb-0 flex flex-col">
            <SEO
                title={`${product?.name || 'Your Horoscope'} | Ayodhya Agarbatti`}
                description="Your computed Vedic horoscope report."
                canonical="https://www.ayodhyaagarbatti.in/horoscope/result"
                ogType="website"
            />
            <div className="max-w-6xl mx-auto w-full px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-ivory/80 sticky top-0 z-10">
                <Link to="/horoscope" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gold">
                    <ArrowLeft size={14} /> Back to readings
                </Link>
                <button
                    onClick={downloadPdf}
                    className="btn-primary flex items-center gap-2 hover:bg-gold hover:text-charcoal"
                >
                    <Download size={14} /> Download PDF
                </button>
            </div>
            <iframe
                ref={iframeRef}
                src={engineUrl}
                title="Vedic horoscope report"
                className="w-full flex-grow border-0"
                style={{ minHeight: '85vh' }}
            />
        </div>
    );
};

export default HoroscopeResult;
