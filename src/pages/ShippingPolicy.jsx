import React from 'react';
import { Truck, PackageCheck, MapPin, RefreshCw, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const shippingSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Shipping and Exchange Policy | Ayodhya Agarbatti",
    "description": "Delivery timelines, shipping charges, and exchange process for Ayodhya Agarbatti incense orders.",
    "url": "https://www.ayodhyaagarbatti.in/shipping-policy",
    "publisher": {
        "@type": "Organization",
        "name": "Ayodhya Agarbatti",
        "logo": { "@type": "ImageObject", "url": "https://www.ayodhyaagarbatti.in/images/ayodhya_logo.png" }
    }
};

const breadcrumbs = [
    { name: 'Home', url: 'https://www.ayodhyaagarbatti.in/' },
    { name: 'Shipping and Exchange', url: 'https://www.ayodhyaagarbatti.in/shipping-policy' }
];

const ShippingPolicy = () => {
    return (
        <div className="pt-32 pb-24 bg-ivory text-charcoal min-h-screen">
            <SEO
                title="Shipping and Exchange Policy | Ayodhya Agarbatti"
                description="Delivery timelines, shipping charges, tracking, and the exchange process for Ayodhya Agarbatti incense orders across India."
                canonical="https://www.ayodhyaagarbatti.in/shipping-policy"
                ogImage="https://www.ayodhyaagarbatti.in/images/ayodhya_package.png"
                schema={shippingSchema}
                breadcrumbs={breadcrumbs}
            />

            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 mb-8 font-bold">
                    <Link to="/" className="hover:text-gold transition-colors flex items-center gap-1">
                        <ArrowLeft size={14} /> Back to Sanctuary
                    </Link>
                    <span>/</span>
                    <span className="text-gold">Shipping & Exchange</span>
                </div>

                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-gold mb-3 block">
                        From Ayodhya, To You
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Shipping & Exchange</h1>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Every order is packed with care in Ayodhya and shipped across India. Here's what to expect.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-4">
                            <Truck size={22} />
                        </div>
                        <h3 className="font-heading text-base text-charcoal mb-1">3-7 Day Delivery</h3>
                        <p className="text-xs text-gray-500">Pan-India shipping, faster in metro cities.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                            <PackageCheck size={22} />
                        </div>
                        <h3 className="font-heading text-base text-charcoal mb-1">Free Shipping</h3>
                        <p className="text-xs text-gray-500">On orders above ₹500, else ₹79 delivery.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4">
                            <RefreshCw size={22} />
                        </div>
                        <h3 className="font-heading text-base text-charcoal mb-1">Easy Exchange</h3>
                        <p className="text-xs text-gray-500">Wrong or damaged item swapped at no cost.</p>
                    </div>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200/80 shadow-sm space-y-10 text-sm text-gray-700">

                    <section className="space-y-3">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <Truck size={18} className="text-gold" /> 1. Delivery Timelines
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                            Orders are dispatched within 24-48 hours of confirmation. Delivery typically takes
                            3-5 business days in metro cities and 5-7 business days elsewhere in India, via our
                            courier partners. You'll receive a tracking link by email/SMS once shipped.
                        </p>
                    </section>

                    <section className="space-y-3 pt-6 border-t border-gray-100">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <MapPin size={18} className="text-gold" /> 2. Shipping Charges & Coverage
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>Free shipping on orders above ₹500; a flat ₹79 delivery charge applies below that.</li>
                            <li>Cash on Delivery is available on select pincodes.</li>
                            <li>We currently ship within India only; horoscope readings are digital and delivered by email worldwide.</li>
                        </ul>
                    </section>

                    <section className="space-y-3 pt-6 border-t border-gray-100">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <RefreshCw size={18} className="text-gold" /> 3. Exchange Process
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                            If you receive a damaged, defective, or incorrect item, request an exchange within 7 days
                            of delivery — we arrange free reverse pickup and dispatch the correct item at no extra
                            cost. For refund eligibility and timelines instead of an exchange, see our{' '}
                            <Link to="/return-policy" className="text-gold font-bold hover:underline">Cancellation and Refund Policy</Link>.
                        </p>
                    </section>

                    <section className="space-y-3 pt-6 border-t border-gray-100">
                        <h2 className="font-heading text-xl text-charcoal flex items-center gap-2">
                            <PackageCheck size={18} className="text-gold" /> 4. Undelivered or Delayed Orders
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                            If your order hasn't arrived within the expected window, contact support with your order
                            number and we'll trace it with the courier within 24 hours, offering a reship or refund
                            if it's confirmed lost in transit.
                        </p>
                    </section>

                    <div className="bg-charcoal text-ivory p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                        <div>
                            <h3 className="font-heading text-lg text-gold">Where's My Order?</h3>
                            <p className="text-xs text-gray-300 mt-1">Our support team in Ayodhya is available Mon-Sat (9 AM - 6 PM IST).</p>
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

export default ShippingPolicy;
