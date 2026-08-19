import React from 'react';
import { Lock, Eye, Database, Share2, Cookie, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy | Ayodhya Agarbatti",
    "description": "How Ayodhya Agarbatti collects, uses, and protects your personal data.",
    "url": "https://www.ayodhyaagarbatti.in/privacy-policy",
    "publisher": {
        "@type": "Organization",
        "name": "Ayodhya Agarbatti",
        "logo": { "@type": "ImageObject", "url": "https://www.ayodhyaagarbatti.in/images/ayodhya_logo.png" }
    }
};

const breadcrumbs = [
    { name: 'Home', url: 'https://www.ayodhyaagarbatti.in/' },
    { name: 'Privacy Policy', url: 'https://www.ayodhyaagarbatti.in/privacy-policy' }
];

const PrivacyPolicy = () => {
    return (
        <div className="pt-32 pb-24 bg-ivory text-charcoal min-h-screen">
            <SEO
                title="Privacy Policy | Ayodhya Agarbatti"
                description="Read how Ayodhya Agarbatti collects, uses, stores, and protects your personal information across our website, orders, and horoscope readings."
                canonical="https://www.ayodhyaagarbatti.in/privacy-policy"
                ogImage="https://www.ayodhyaagarbatti.in/images/ayodhya_package.png"
                schema={privacySchema}
                breadcrumbs={breadcrumbs}
            />

            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 mb-8 font-bold">
                    <Link to="/" className="hover:text-gold transition-colors flex items-center gap-1">
                        <ArrowLeft size={14} /> Back to Sanctuary
                    </Link>
                    <span>/</span>
                    <span className="text-gold">Privacy Policy</span>
                </div>

                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-gold mb-3 block">
                        Your Trust, Protected
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Privacy Policy</h1>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Last updated: 19 August 2026. Ayodhya Agarbatti ("we", "us") respects your privacy. This
                        policy explains what data we collect, why, and how you can control it.
                    </p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200/80 shadow-sm space-y-10 text-sm text-gray-700">

                    <section className="space-y-3">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <Database size={18} className="text-gold" /> 1. Information We Collect
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li><strong>Contact & shipping details:</strong> name, email, phone, and address, collected at checkout to fulfil orders.</li>
                            <li><strong>Birth details for horoscope readings:</strong> date, time, and place of birth, used only to generate the chart you purchase.</li>
                            <li><strong>Payment data:</strong> handled entirely by Razorpay; we never see or store your card, UPI, or bank details.</li>
                            <li><strong>Usage data:</strong> pages visited and interactions, via Google Analytics and Firebase, to improve the site.</li>
                        </ul>
                    </section>

                    <section className="space-y-3 pt-6 border-t border-gray-100">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <Eye size={18} className="text-gold" /> 2. How We Use Your Information
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>Process, ship, and support your orders.</li>
                            <li>Generate and deliver the horoscope reading you paid for.</li>
                            <li>Send order updates, receipts, and — if you opt in — newsletters.</li>
                            <li>Detect fraud, secure payments, and comply with legal obligations.</li>
                        </ul>
                    </section>

                    <section className="space-y-3 pt-6 border-t border-gray-100">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <Share2 size={18} className="text-gold" /> 3. Sharing Your Information
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                            We never sell your data. We share only what's necessary with trusted processors: Razorpay
                            (payments), Firebase (order storage), and our courier partners (delivery). Each is bound
                            to use your data solely to perform their service for us.
                        </p>
                    </section>

                    <section className="space-y-3 pt-6 border-t border-gray-100">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <Cookie size={18} className="text-gold" /> 4. Cookies & Analytics
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                            We use essential cookies to run the cart and checkout, and analytics cookies (Google
                            Analytics) to understand site traffic. You can disable cookies in your browser settings;
                            core shopping features may stop working if you do.
                        </p>
                    </section>

                    <section className="space-y-3 pt-6 border-t border-gray-100">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <Lock size={18} className="text-gold" /> 5. Data Security & Your Rights
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                            Data is transmitted over SSL and stored with access-controlled providers. You may request
                            access to, correction of, or deletion of your personal data at any time by contacting us
                            below; we respond within 7 business days.
                        </p>
                    </section>

                    <div className="bg-charcoal text-ivory p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                        <div>
                            <h3 className="font-heading text-lg text-gold">Questions About Your Data?</h3>
                            <p className="text-xs text-gray-300 mt-1">Write to us at <a href="mailto:namaste@ayodhyaagarbatti.com" className="underline">namaste@ayodhyaagarbatti.com</a></p>
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

export default PrivacyPolicy;
