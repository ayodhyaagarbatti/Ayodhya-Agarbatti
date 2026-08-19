import React from 'react';
import { ShieldCheck, RefreshCw, Truck, HeartHandshake, AlertCircle, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO, { breadcrumbSchema, faqSchema } from '../components/SEO';

const returnPolicySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Return & Refund Policy | Ayodhya Agarbatti",
    "description": "Ayodhya Agarbatti's 7-Day hassle-free Return, Replacement, and Refund policy for natural charcoal-free incense sticks hand-rolled in Ayodhya.",
    "url": "https://www.ayodhyaagarbatti.in/return-policy",
    "publisher": {
        "@type": "Organization",
        "name": "Ayodhya Agarbatti",
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.ayodhyaagarbatti.in/images/ayodhya_logo.png"
        }
    },
    "mainEntity": {
        "@type": "Service",
        "name": "Return & Replacement Service",
        "description": "7-day replacement for damaged, defective, or incorrect incense products. Free reverse pickup across India.",
        "provider": {
            "@type": "Organization",
            "name": "Ayodhya Agarbatti"
        },
        "areaServed": "India",
        "termsOfService": "https://www.ayodhyaagarbatti.in/return-policy"
    }
};

const breadcrumbs = [
    { name: 'Home', url: 'https://www.ayodhyaagarbatti.in/' },
    { name: 'Return Policy', url: 'https://www.ayodhyaagarbatti.in/return-policy' }
];

const returnFaqs = [
    {
        question: "What is Ayodhya Agarbatti's return policy?",
        answer: "We offer a 7-day replacement policy for incense products that arrive damaged, defective, or incorrect. We arrange free reverse pickup at no extra charge. Due to the consumable nature of incense, opened or burnt packs cannot be returned unless proven defective upon arrival."
    },
    {
        question: "How do I request a return or replacement?",
        answer: "Contact our support team at support@ayodhyaagarbatti.com or WhatsApp +91 98765 43210 with your Order Number (e.g., AYD-123456) and a photo/video showing the issue. We verify within 24 hours and dispatch a fresh replacement at zero additional shipping cost."
    },
    {
        question: "How long does a refund take to process?",
        answer: "For prepaid orders (Razorpay/UPI/Card), refunds are credited to your original payment method within 5-7 business days. For Cash on Delivery orders, refunds are transferred to your bank account via UPI/NEFT within 48 hours of verification."
    },
    {
        question: "Do I need to return free gifts (like brass holders) with the product?",
        answer: "Yes, free promotional gifts included in bundle packages (such as brass incense holders) must be returned alongside the original main product for a valid replacement or refund."
    },
    {
        question: "What if my incense sticks arrive broken or damaged?",
        answer: "This is covered under our 7-day replacement policy. Simply share a photo/video of the damaged items with your order number, and we'll dispatch a fresh replacement at no cost to you."
    }
];

const ReturnPolicy = () => {
    return (
        <div className="pt-32 pb-24 bg-ivory text-charcoal min-h-screen">
            <SEO
                title="Return & Refund Policy | Ayodhya Agarbatti - 7 Day Hassle-Free Replacement"
                description="Read Ayodhya Agarbatti's 7-Day hassle-free Return, Replacement, and Refund policy for natural charcoal-free incense sticks. Free reverse pickup across India. Prepaid refunds in 5-7 days, COD refunds in 48 hours."
                keywords="Ayodhya Agarbatti return policy, agarbatti refund policy, incense replacement policy, 7 day return incense, free pickup return India, COD refund incense"
                canonical="https://www.ayodhyaagarbatti.in/return-policy"
                ogImage="https://www.ayodhyaagarbatti.in/images/ayodhya_package.png"
                schema={returnPolicySchema}
                breadcrumbs={breadcrumbs}
                faqs={returnFaqs}
            />

            <div className="max-w-4xl mx-auto px-6">
                
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 mb-8 font-bold">
                    <Link to="/" className="hover:text-gold transition-colors flex items-center gap-1">
                        <ArrowLeft size={14} /> Back to Sanctuary
                    </Link>
                    <span>/</span>
                    <span className="text-gold">Return Policy</span>
                </div>

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-gold mb-3 block">
                        Purity & Trust Guarantee
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
                        Return & Refund Policy
                    </h1>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        At Ayodhya Agarbatti, every incense stick is hand-rolled with sacred temple flowers and natural botanicals. We stand behind the divine quality of our products with our 100% Satisfaction Guarantee.
                    </p>
                </div>

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-4">
                            <RefreshCw size={22} />
                        </div>
                        <h3 className="font-heading text-base text-charcoal mb-1">7-Day Replacement</h3>
                        <p className="text-xs text-gray-500">Free replacement for items damaged in transit or incorrect orders.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                            <ShieldCheck size={22} />
                        </div>
                        <h3 className="font-heading text-base text-charcoal mb-1">100% Soot-Free</h3>
                        <p className="text-xs text-gray-500">Guaranteed 100% charcoal-free & non-toxic formulation.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4">
                            <Truck size={22} />
                        </div>
                        <h3 className="font-heading text-base text-charcoal mb-1">Zero Cost Pickup</h3>
                        <p className="text-xs text-gray-500">We arrange reverse pickup at no extra charge for valid returns.</p>
                    </div>
                </div>

                {/* Detailed Policy Content */}
                <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200/80 shadow-sm space-y-10 text-sm text-gray-700">
                    
                    {/* Section 1 */}
                    <section className="space-y-3">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-gold" /> 1. Eligibility for Returns & Replacements
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                            You may request a replacement or full refund within <strong>7 calendar days</strong> from the date of delivery under the following conditions:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>The incense product arrived damaged, broken, or defective.</li>
                            <li>The outer package seal was tampered with during courier transit.</li>
                            <li>An incorrect variant or item was delivered to your address.</li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-3 pt-6 border-t border-gray-100">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <AlertCircle size={18} className="text-gold" /> 2. Consumable Product Hygiene Policy
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                            Due to the sacred, natural, and personal consumable nature of incense products:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>Incense stick packs that have been unsealed, opened, or burnt cannot be returned unless proven defective or damaged upon arrival.</li>
                            <li>Free promotional gifts (such as brass incense holders) included in bundle packages must be returned alongside the original main product.</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-3 pt-6 border-t border-gray-100">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <RefreshCw size={18} className="text-gold" /> 3. How to Request a Return or Replacement
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                            Requesting a replacement is quick and effortless:
                        </p>
                        <ol className="list-decimal pl-6 space-y-3 text-gray-600">
                            <li>
                                <strong>Contact Us:</strong> Email our support team at <a href="mailto:support@ayodhyaagarbatti.com" className="text-gold font-bold hover:underline">support@ayodhyaagarbatti.com</a> or WhatsApp us at <strong>+91 98765 43210</strong>.
                            </li>
                            <li>
                                <strong>Provide Details:</strong> Share your Order Number (e.g. <code>AYD-123456</code>) along with a short photo or video unboxing clip showing the issue.
                            </li>
                            <li>
                                <strong>Dispatch & Replacement:</strong> Upon verification within 24 hours, our team will dispatch a fresh replacement packet directly to your doorstep at zero additional shipping cost.
                            </li>
                        </ol>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-3 pt-6 border-t border-gray-100">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <HeartHandshake size={18} className="text-gold" /> 4. Refund Processing & Timelines
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                            In cases where a replacement cannot be provided or you request a monetary refund:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h4 className="font-bold text-charcoal text-xs uppercase mb-1">Prepaid Orders (Razorpay / UPI / Card)</h4>
                                <p className="text-xs text-gray-500">Refunds are credited directly to your original payment method within <strong>5–7 business days</strong>.</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h4 className="font-bold text-charcoal text-xs uppercase mb-1">Cash on Delivery (COD Orders)</h4>
                                <p className="text-xs text-gray-500">Refunds are transferred directly to your bank account via UPI / NEFT within <strong>48 hours</strong> of verification.</p>
                            </div>
                        </div>
                    </section>

                    {/* Contact Support Footer Box */}
                    <div className="bg-charcoal text-ivory p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                        <div>
                            <h3 className="font-heading text-lg text-gold">Need Help With Your Order?</h3>
                            <p className="text-xs text-gray-300 mt-1">Our support team in Ayodhya is available Mon–Sat (9 AM – 6 PM IST).</p>
                        </div>
                        <Link
                            to="/contact"
                            className="bg-gold text-charcoal px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-charcoal transition-all shrink-0 flex items-center gap-2"
                        >
                            <Mail size={16} /> Contact Support
                        </Link>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ReturnPolicy;
