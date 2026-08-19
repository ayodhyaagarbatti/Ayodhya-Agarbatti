import React from 'react';
import { FileText, ShoppingBag, CreditCard, Sparkles, ShieldAlert, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const termsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms and Conditions | Ayodhya Agarbatti",
    "description": "The terms governing use of the Ayodhya Agarbatti website, orders, and horoscope services.",
    "url": "https://www.ayodhyaagarbatti.in/terms-and-conditions",
    "publisher": {
        "@type": "Organization",
        "name": "Ayodhya Agarbatti",
        "logo": { "@type": "ImageObject", "url": "https://www.ayodhyaagarbatti.in/images/ayodhya_logo.png" }
    }
};

const breadcrumbs = [
    { name: 'Home', url: 'https://www.ayodhyaagarbatti.in/' },
    { name: 'Terms and Conditions', url: 'https://www.ayodhyaagarbatti.in/terms-and-conditions' }
];

const TermsAndConditions = () => {
    return (
        <div className="pt-32 pb-24 bg-ivory text-charcoal min-h-screen">
            <SEO
                title="Terms and Conditions | Ayodhya Agarbatti"
                description="The terms and conditions governing your use of the Ayodhya Agarbatti website, product orders, and Vedic horoscope readings."
                canonical="https://www.ayodhyaagarbatti.in/terms-and-conditions"
                ogImage="https://www.ayodhyaagarbatti.in/images/ayodhya_package.png"
                schema={termsSchema}
                breadcrumbs={breadcrumbs}
            />

            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 mb-8 font-bold">
                    <Link to="/" className="hover:text-gold transition-colors flex items-center gap-1">
                        <ArrowLeft size={14} /> Back to Sanctuary
                    </Link>
                    <span>/</span>
                    <span className="text-gold">Terms and Conditions</span>
                </div>

                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-gold mb-3 block">
                        The Fine Print
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Terms and Conditions</h1>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Last updated: 19 August 2026. By browsing or buying from ayodhyaagarbatti.in, you agree to
                        the terms below.
                    </p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200/80 shadow-sm space-y-10 text-sm text-gray-700">

                    <section className="space-y-3">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <FileText size={18} className="text-gold" /> 1. Use of This Website
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                            This site and its content are owned by Ayodhya Agarbatti. You may browse and purchase for
                            personal use; copying, reselling, or scraping content or product data without written
                            permission is not allowed.
                        </p>
                    </section>

                    <section className="space-y-3 pt-6 border-t border-gray-100">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <ShoppingBag size={18} className="text-gold" /> 2. Orders & Pricing
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>All prices are in INR and inclusive of applicable taxes unless stated otherwise.</li>
                            <li>We reserve the right to correct pricing errors and cancel affected orders with a full refund.</li>
                            <li>An order is confirmed only once payment is successfully verified.</li>
                        </ul>
                    </section>

                    <section className="space-y-3 pt-6 border-t border-gray-100">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <CreditCard size={18} className="text-gold" /> 3. Payments
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                            Payments are processed securely via Razorpay. We do not store your card, UPI, or banking
                            details. Refunds, where applicable, follow our{' '}
                            <Link to="/return-policy" className="text-gold font-bold hover:underline">Cancellation and Refund Policy</Link>.
                        </p>
                    </section>

                    <section className="space-y-3 pt-6 border-t border-gray-100">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <Sparkles size={18} className="text-gold" /> 4. Horoscope Readings
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                            Vedic horoscope readings are generated from the birth details you provide and are sold
                            for entertainment and self-reflection purposes. Accuracy depends on the details you
                            submit; we are not liable for decisions made based on a reading. Because these readings
                            are generated instantly and personalized, they are non-refundable once delivered.
                        </p>
                    </section>

                    <section className="space-y-3 pt-6 border-t border-gray-100">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <ShieldAlert size={18} className="text-gold" /> 5. Limitation of Liability & Governing Law
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                            Ayodhya Agarbatti is not liable for indirect or incidental damages arising from use of
                            this site or its products. These terms are governed by the laws of India, with courts in
                            Ayodhya, Uttar Pradesh having exclusive jurisdiction.
                        </p>
                    </section>

                    <div className="bg-charcoal text-ivory p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                        <div>
                            <h3 className="font-heading text-lg text-gold">Questions About These Terms?</h3>
                            <p className="text-xs text-gray-300 mt-1">Reach us at <a href="mailto:namaste@ayodhyaagarbatti.com" className="underline">namaste@ayodhyaagarbatti.com</a></p>
                        </div>
                        <Link
                            to="/contact"
                            className="bg-gold text-charcoal px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-charcoal transition-all shrink-0 flex items-center gap-2"
                        >
                            <Mail size={16} /> Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
