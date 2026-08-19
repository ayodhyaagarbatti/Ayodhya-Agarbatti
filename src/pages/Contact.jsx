import React, { useState } from 'react';
import { Mail, MapPin, Phone, CheckCircle, Send, Loader2, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import SEO from '../components/SEO';

const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Ayodhya Agarbatti",
    "description": "Get in touch with Ayodhya Agarbatti for orders, wholesale inquiries, or support. Based in the holy city of Ayodhya, Uttar Pradesh.",
    "url": "https://www.ayodhyaagarbatti.in/contact",
    "mainEntity": {
        "@type": "Organization",
        "name": "Ayodhya Agarbatti",
        "alternateName": "अयोध्या अगरबत्ती",
        "url": "https://www.ayodhyaagarbatti.in",
        "logo": "https://www.ayodhyaagarbatti.in/images/ayodhya_logo.png",
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "telephone": "+91-98765-43210",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"],
                "hoursAvailable": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    "opens": "09:00",
                    "closes": "18:00",
                    "timeZone": "Asia/Kolkata"
                }
            },
            {
                "@type": "ContactPoint",
                "telephone": "+91-98765-43210",
                "contactType": "wholesale",
                "availableLanguage": ["English", "Hindi"]
            }
        ],
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Temple Road",
            "addressLocality": "Ayodhya",
            "addressRegion": "Uttar Pradesh",
            "postalCode": "224001",
            "addressCountry": "IN"
        },
        "email": "namaste@ayodhyaagarbatti.com",
        "sameAs": [
            "https://www.instagram.com/ayodhyaagarbatti/",
            "https://www.facebook.com/ayodhyaagarbatti",
            "https://www.linkedin.com/in/ayodhya-agarbatti-122b22418/",
            "https://www.youtube.com/@ayodhyaagarbatti"
        ]
    }
};

const breadcrumbs = [
    { name: 'Home', url: 'https://www.ayodhyaagarbatti.in/' },
    { name: 'Contact', url: 'https://www.ayodhyaagarbatti.in/contact' }
];

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        try {
            const messageData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                subject: formData.subject,
                message: formData.message,
                status: 'unread',
                date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, "contact_messages"), messageData);
            setIsSubmitted(true);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                subject: 'General Inquiry',
                message: ''
            });
        } catch (err) {
            console.error("Error saving contact message to database:", err);
            setErrorMsg("Failed to save message to database. Please check your internet connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pt-24 pb-20 bg-white min-h-screen">
            <SEO
                title="Contact Us | Ayodhya Agarbatti - Get in Touch for Orders & Support"
                description="Contact Ayodhya Agarbatti for orders, wholesale inquiries, or support. Based in the holy city of Ayodhya, Uttar Pradesh. Call +91 98765 43210 or email namaste@ayodhyaagarbatti.com. Mon-Sat, 9am-6pm IST."
                keywords="contact Ayodhya Agarbatti, agarbatti customer support, wholesale incense inquiry, Ayodhya incense contact, buy incense support India"
                canonical="https://www.ayodhyaagarbatti.in/contact"
                ogImage="https://www.ayodhyaagarbatti.in/images/ayodhya_logo.png"
                schema={contactSchema}
                breadcrumbs={breadcrumbs}
            />
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">

                {/* Contact Info */}
                <div>
                    <span className="font-cursive text-3xl text-gold mb-4 block">Get in Touch</span>
                    <h1 className="font-heading text-5xl text-charcoal mb-8">We'd Love to Hear from You</h1>
                    <p className="font-body text-gray-500 mb-12 text-lg">
                        Whether you have a question about our fragrances, need assistance with an order, or are interested in wholesale opportunities, our team is here to help.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-6">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-charcoal">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-heading text-xl mb-1 text-charcoal">Visit Us</h3>
                                <p className="text-gray-500">123 Temple Road, Ayodhya<br />Uttar Pradesh, India</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-charcoal">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-heading text-xl mb-1 text-charcoal">Email Us</h3>
                                <p className="text-gray-500">namaste@ayodhyaagarbatti.com<br />support@ayodhyaagarbatti.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-charcoal">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-heading text-xl mb-1 text-charcoal">Call Us</h3>
                                <p className="text-gray-500">+91 98765 43210<br />Mon-Sat, 9am - 6pm IST</p>
                            </div>
                        </div>

                        {/* Official Social Media Handles */}
                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-charcoal mb-4">Official Social Channels</h3>
                            <div className="flex items-center gap-3">
                                <a
                                    href="https://www.instagram.com/ayodhyaagarbatti/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Instagram (@ayodhyaagarbatti)"
                                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-charcoal hover:bg-gold hover:text-white transition-all shadow-sm"
                                >
                                    <Instagram size={18} />
                                </a>
                                <a
                                    href="https://www.facebook.com/ayodhyaagarbatti"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Facebook (Ayodhya Agarbatti)"
                                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-charcoal hover:bg-gold hover:text-white transition-all shadow-sm"
                                >
                                    <Facebook size={18} />
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/ayodhya-agarbatti-122b22418/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="LinkedIn (Ayodhya Agarbatti)"
                                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-charcoal hover:bg-gold hover:text-white transition-all shadow-sm"
                                >
                                    <Linkedin size={18} />
                                </a>
                                <a
                                    href="https://www.youtube.com/@ayodhyaagarbatti"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="YouTube (@ayodhyaagarbatti)"
                                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-charcoal hover:bg-gold hover:text-white transition-all shadow-sm"
                                >
                                    <Youtube size={18} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-gray-50 p-10 rounded-sm border border-gray-100">
                    {isSubmitted ? (
                        <div className="text-center py-12 space-y-4">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="font-heading text-2xl text-charcoal">Message Saved to Database</h3>
                            <p className="text-gray-600 text-sm max-w-md mx-auto">
                                Thank you for contacting Ayodhya Agarbatti. Your message has been stored in our database and our team will get back to you shortly.
                            </p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="btn-primary mt-6 px-8 py-3 text-xs uppercase tracking-widest"
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-200 p-3 focus:outline-none focus:border-gold transition-colors"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-200 p-3 focus:outline-none focus:border-gold transition-colors"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-200 p-3 focus:outline-none focus:border-gold transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Subject</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-200 p-3 focus:outline-none focus:border-gold transition-colors"
                                >
                                    <option value="General Inquiry">General Inquiry</option>
                                    <option value="Order Support">Order Support</option>
                                    <option value="Wholesale">Wholesale</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-200 p-3 focus:outline-none focus:border-gold transition-colors"
                                    placeholder="Write your message here..."
                                ></textarea>
                            </div>

                            {errorMsg && (
                                <p className="text-red-500 text-xs font-bold text-center">{errorMsg}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>Saving to Database...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Contact;
