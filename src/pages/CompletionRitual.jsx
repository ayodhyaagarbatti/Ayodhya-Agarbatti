import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Wind, AlertTriangle, Sparkles, ArrowLeft, ShoppingBag } from 'lucide-react';
import SEO, { breadcrumbSchema, faqSchema } from '../components/SEO';

const ritualSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "The Completion Ritual | Ayodhya Agarbatti",
    "description": "Ayodhya Agarbatti's signature Completion Ritual - a closing ceremony where you light your final sticks together to mark the end of one sacred cycle before beginning the next.",
    "url": "https://www.ayodhyaagarbatti.in/completion-ritual",
    "publisher": {
        "@type": "Organization",
        "name": "Ayodhya Agarbatti",
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.ayodhyaagarbatti.in/images/ayodhya_logo.png"
        }
    }
};

const breadcrumbs = [
    { name: 'Home', url: 'https://www.ayodhyaagarbatti.in/' },
    { name: 'The Completion Ritual', url: 'https://www.ayodhyaagarbatti.in/completion-ritual' }
];

const ritualFaqs = [
    {
        question: "Why light all the remaining sticks together instead of one at a time?",
        answer: "It's a deliberate close to the cycle you began with your first stick from the pack - a single, fuller moment of gratitude and reflection rather than letting the pack simply run out unnoticed."
    },
    {
        question: "Is it safe to burn multiple incense sticks at once?",
        answer: "Yes, with care: use multiple stable, fire-safe holders (not one holder crowded with sticks), burn in a well-ventilated room, never leave them unattended, and keep them well away from curtains, papers, and anything flammable."
    },
    {
        question: "How many sticks are left when I do the Completion Ritual?",
        answer: "Every Ayodhya Agarbatti pack has 33 hand-rolled sticks. Most people arrive at this ritual with somewhere between 3 and 8 remaining - however many are left when you feel the pack's cycle is ready to close."
    }
];

const steps = [
    {
        title: 'Choose your moment',
        body: 'Set aside 45-50 minutes where you won’t be interrupted - the same time it takes a single stick to burn fully. Evening, just before rest, works well for most people.'
    },
    {
        title: 'Prepare your space',
        body: 'Open a window or door for airflow. Set out enough stable, fire-safe holders for every remaining stick - never crowd multiple sticks into one holder.'
    },
    {
        title: 'Pause before lighting',
        body: 'Hold the remaining sticks for a moment. This pack accompanied a stretch of your days - acknowledge what it held before you close it out.'
    },
    {
        title: 'Light them together',
        body: 'Light each stick, place it in its own holder, and let the flame settle into a steady ember before you step back.'
    },
    {
        title: 'Sit with it',
        body: 'Stay in the room while the smoke rises. Let your mind go quiet, or simply notice the fragrance change as the sticks burn down together.'
    },
    {
        title: 'Begin again',
        body: 'Once every stick has burned out completely, the cycle is closed. Your next pack starts the next one.'
    }
];

const CompletionRitual = () => {
    return (
        <div className="min-h-screen bg-ivory/50 pt-28 pb-20">
            <SEO
                title="The Completion Ritual | A Signature Ayodhya Agarbatti Ceremony"
                description="Ayodhya Agarbatti's signature Completion Ritual - when you reach the last sticks of a pack, light them together in one closing ceremony instead of finishing them one by one."
                keywords="Ayodhya Agarbatti ritual, completion ritual, incense ceremony, incense ritual guide, how to use agarbatti, sacred incense practice"
                canonical="https://www.ayodhyaagarbatti.in/completion-ritual"
                ogImage="https://www.ayodhyaagarbatti.in/images/ritual_moment.png"
                ogType="article"
                schema={ritualSchema}
                breadcrumbs={breadcrumbs}
                faqs={ritualFaqs}
            />

            <div className="max-w-3xl mx-auto px-6">
                <Link to="/" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gold mb-8">
                    <ArrowLeft size={14} /> Back home
                </Link>

                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-gold mb-4">
                    <Sparkles size={14} /> A Signature Ayodhya Agarbatti Ritual
                </span>
                <h1 className="font-serif text-4xl md:text-6xl text-charcoal mb-6 leading-tight">
                    The Completion Ritual
                </h1>
                <p className="font-body text-gray-600 text-lg leading-relaxed mb-6">
                    Every Ayodhya Agarbatti pack holds 33 hand-rolled sticks. Most people burn them one at a time, day after day, until the pack quietly runs out. The Completion Ritual is a different way to close that chapter: when you're down to the last few sticks, gather them and light them together, all at once, in a single closing ceremony.
                </p>
                <p className="font-body text-gray-600 text-lg leading-relaxed mb-12">
                    It's a small, deliberate pause - a way of marking that one cycle has ended before the next one, with a new pack, begins.
                </p>

                <div className="rounded-2xl overflow-hidden mb-12 border border-gray-100 shadow-sm">
                    <img
                        src="/images/ritual_moment.png"
                        alt="Fragrant smoke rising from a lit incense stick in a dark, meditative room"
                        loading="lazy"
                        className="w-full h-64 md:h-80 object-cover"
                    />
                </div>

                <h2 className="font-heading text-2xl text-charcoal mb-8 flex items-center gap-2">
                    <Flame className="text-gold" size={22} /> How to Perform It
                </h2>

                <ol className="space-y-6 mb-16">
                    {steps.map((step, idx) => (
                        <li key={step.title} className="flex gap-5">
                            <span className="shrink-0 w-9 h-9 rounded-full bg-charcoal text-gold font-heading font-bold flex items-center justify-center text-sm">
                                {idx + 1}
                            </span>
                            <div>
                                <h3 className="font-heading text-base text-charcoal mb-1">{step.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{step.body}</p>
                            </div>
                        </li>
                    ))}
                </ol>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8 mb-16">
                    <h2 className="font-heading text-lg text-amber-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-amber-600" size={20} /> Burn Safely
                    </h2>
                    <ul className="space-y-2 text-amber-900/90 text-sm leading-relaxed list-disc pl-5">
                        <li>Use a separate, stable, fire-safe holder for every stick - never crowd several sticks into one holder.</li>
                        <li>Burn in a well-ventilated room; open a window or door for airflow.</li>
                        <li>Never leave burning sticks unattended, even for a few minutes.</li>
                        <li>Keep well away from curtains, papers, bedding, and anything else flammable.</li>
                        <li>Keep out of reach of children and pets.</li>
                        <li>Let every stick burn out completely and cool before leaving the room for the night.</li>
                    </ul>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest mb-4">
                    <Wind size={14} /> Prefer the everyday ritual?
                </div>
                <p className="text-gray-600 text-sm mb-8">
                    The Completion Ritual is for closing out a pack. For lighting a single stick as part of your daily practice, see <Link to="/#ritual" className="text-gold font-semibold hover:underline">our everyday ritual guide</Link> on the homepage.
                </p>

                <div className="text-center bg-charcoal rounded-2xl p-10">
                    <p className="font-serif text-2xl text-ivory mb-6">Ready to begin a new cycle?</p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 bg-gold text-charcoal px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-white transition-all"
                    >
                        <ShoppingBag size={16} /> Shop Incense
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CompletionRitual;
