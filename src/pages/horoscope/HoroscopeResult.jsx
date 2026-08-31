import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Download, ArrowLeft } from 'lucide-react';
import SEO from '../../components/SEO';
import { buildHoroscopeEngineUrl } from '../../utils/horoscopeChartEncode';

const HoroscopeResult = () => {
    const location = useLocation();
    const { subject, partner, product } = location.state || {};
    const iframeRef = useRef(null);
    const resizeObserverRef = useRef(null);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);
    // Iframes don't auto-size to their content, so on mobile a fixed-height
    // iframe traps a tall report behind its own tiny internal scrollbar.
    // Same-origin, so we can read the real content height and grow to fit -
    // the outer page scrolls naturally instead.
    const [iframeHeight, setIframeHeight] = useState('85vh');

    const engineUrl = useMemo(() => (subject ? buildHoroscopeEngineUrl(subject, partner) : null), [subject, partner]);

    useEffect(() => () => resizeObserverRef.current?.disconnect(), []);

    if (!subject || !engineUrl) {
        return (
            <div className="min-h-screen pt-32 text-center bg-gray-50 flex flex-col items-center justify-center px-6">
                <h2 className="text-2xl font-heading mb-4 text-charcoal">No reading to show yet.</h2>
                <Link to="/horoscope" className="btn-primary bg-charcoal text-white hover:bg-gold hover:text-charcoal">View readings</Link>
            </div>
        );
    }

    const downloadPdf = () => {
        if (!isIframeLoaded) return;
        iframeRef.current?.contentWindow?.print();
    };

    const handleIframeLoad = () => {
        setIsIframeLoaded(true);
        try {
            const root = iframeRef.current?.contentWindow?.document?.documentElement;
            if (!root) return;

            const syncHeight = () => setIframeHeight(`${root.scrollHeight}px`);
            syncHeight();

            resizeObserverRef.current?.disconnect();
            resizeObserverRef.current = new ResizeObserver(syncHeight);
            resizeObserverRef.current.observe(root);
        } catch (err) {
            // Same-origin, so this shouldn't throw - if it ever does, the 85vh fallback still works.
        }
    };

    return (
        <div className="min-h-screen bg-ivory/50 pt-28 pb-0 flex flex-col">
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
                    disabled={!isIframeLoaded}
                    className="btn-primary flex items-center gap-2 hover:bg-gold hover:text-charcoal disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download size={14} /> {isIframeLoaded ? 'Download PDF' : 'Preparing report...'}
                </button>
            </div>
            <iframe
                ref={iframeRef}
                src={engineUrl}
                title="Vedic horoscope report"
                className="w-full flex-grow border-0"
                style={{ minHeight: '85vh', height: iframeHeight }}
                onLoad={handleIframeLoad}
            />
        </div>
    );
};

export default HoroscopeResult;
