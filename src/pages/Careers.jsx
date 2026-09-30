import React from 'react';
import {
    Lightbulb, Users, Sprout, TrendingUp, ArrowRight, MapPin, Clock,
    Megaphone, PenSquare, Palette, HeartHandshake, Boxes, Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const APPLY_FORM_URL = 'https://forms.gle/7RyepGRMD3BRBdXW7';

const openRoles = [
    {
        icon: Megaphone,
        title: 'Digital Marketing & Social Media Intern',
        type: 'Internship',
        location: 'Remote / Ayodhya, UP',
        description: 'Plan and execute campaigns across Instagram, Facebook, and YouTube for a growing D2C incense brand. Assist with paid ads, influencer outreach, and content calendars.'
    },
    {
        icon: PenSquare,
        title: 'Content Writing & SEO Intern',
        type: 'Internship',
        location: 'Remote',
        description: 'Write blog articles, product descriptions, and on-page SEO copy that helps devotees and incense lovers discover Ayodhya Agarbatti online.'
    },
    {
        icon: Palette,
        title: 'Graphic Design Intern',
        type: 'Internship',
        location: 'Remote / Ayodhya, UP',
        description: 'Design packaging mockups, festive campaign creatives, and social media visuals rooted in temple-inspired, sacred aesthetics.'
    },
    {
        icon: HeartHandshake,
        title: 'Business Development & Sales Intern',
        type: 'Internship',
        location: 'Ayodhya, UP',
        description: 'Support wholesale and retail partnerships with temples, gift stores, and pooja suppliers across India. Build outreach lists and pitch decks.'
    },
    {
        icon: Boxes,
        title: 'Operations & Supply Chain Intern',
        type: 'Internship',
        location: 'Ayodhya, UP',
        description: 'Coordinate with our manufacturing and packing units, help streamline order fulfilment, and support quality checks on incense batches.'
    }
];

const perks = [
    { icon: Lightbulb, label: 'Learn & Grow' },
    { icon: Users, label: 'Work on Real Projects' },
    { icon: Sprout, label: 'Be Part of a Meaningful Brand' },
    { icon: TrendingUp, label: 'Gain Practical Experience' }
];

const careersFaqs = [
    {
        question: 'How do I apply for a job or internship at Ayodhya Agarbatti?',
        answer: 'Fill out our online application form at forms.gle/7RyepGRMD3BRBdXW7 with your details, resume link, and the role you are interested in. Our team reviews applications on a rolling basis and reaches out to shortlisted candidates via email or phone.'
    },
    {
        question: 'Are Ayodhya Agarbatti internships paid?',
        answer: 'Yes, our internships come with a performance-based stipend along with a certificate of completion and a letter of recommendation for outstanding interns.'
    },
    {
        question: 'Can I apply for an internship remotely from anywhere in India?',
        answer: 'Many of our internship roles (marketing, content, design) are remote-friendly. Operations and business development roles are based in Ayodhya, Uttar Pradesh.'
    },
    {
        question: 'What is the duration of an internship at Ayodhya Agarbatti?',
        answer: 'Our internships typically run for 2 to 6 months, depending on the role and the candidate\'s availability. Flexible durations can be discussed during the interview.'
    },
    {
        question: 'Does Ayodhya Agarbatti hire freshers?',
        answer: 'Yes. We actively welcome freshers, students, and recent graduates who are eager to learn and contribute to a growing heritage incense brand from Ayodhya.'
    }
];

const breadcrumbs = [
    { name: 'Home', url: 'https://www.ayodhyaagarbatti.in/' },
    { name: 'Careers & Internships', url: 'https://www.ayodhyaagarbatti.in/careers' }
];

const jobPostingSchema = openRoles.map((role) => ({
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: role.title,
    description: `${role.description} Join Ayodhya Agarbatti, a heritage incense brand hand-rolling premium agarbatti in the holy city of Ayodhya, and gain hands-on experience while working on real projects.`,
    identifier: {
        '@type': 'PropertyValue',
        name: 'Ayodhya Agarbatti',
        value: role.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    },
    datePosted: '2026-09-30',
    validThrough: '2027-03-31',
    employmentType: 'INTERN',
    hiringOrganization: {
        '@type': 'Organization',
        name: 'Ayodhya Agarbatti',
        sameAs: 'https://www.ayodhyaagarbatti.in',
        logo: 'https://www.ayodhyaagarbatti.in/images/ayodhya_logo.png'
    },
    jobLocation: {
        '@type': 'Place',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Ayodhya',
            addressRegion: 'Uttar Pradesh',
            addressCountry: 'IN'
        }
    },
    jobLocationType: role.location.toLowerCase().includes('remote') ? 'TELECOMMUTE' : undefined,
    applicantLocationRequirements: role.location.toLowerCase().includes('remote') ? {
        '@type': 'Country',
        name: 'India'
    } : undefined,
    directApply: true,
    applicationContact: {
        '@type': 'ContactPoint',
        email: 'namaste@ayodhyaagarbatti.com',
        contactType: 'HR'
    }
}));

const Careers = () => {
    return (
        <div className="pt-28 pb-24 bg-white min-h-screen">
            <SEO
                title="Careers & Internships at Ayodhya Agarbatti | Jobs & Opportunities"
                description="Explore careers and internship opportunities at Ayodhya Agarbatti. We're hiring interns in marketing, content, design, sales, and operations. Apply now via our Google Form and join a growing heritage incense brand from Ayodhya."
                keywords="Ayodhya Agarbatti careers, incense company jobs, internship Ayodhya, work with Ayodhya Agarbatti, agarbatti company internship, marketing internship India, remote internship India, jobs Ayodhya Uttar Pradesh, hiring interns"
                canonical="https://www.ayodhyaagarbatti.in/careers"
                ogImage="https://www.ayodhyaagarbatti.in/images/ayodhya-agarbatti-hiring-interns-careers.png"
                schema={jobPostingSchema}
                breadcrumbs={breadcrumbs}
                faqs={careersFaqs}
            />

            {/* Hero */}
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="font-cursive text-3xl text-gold mb-4 block">Careers & Internships</span>
                    <h1 className="font-heading text-4xl md:text-5xl text-charcoal mb-6">
                        Jobs & Internship Opportunities at Ayodhya Agarbatti
                    </h1>
                    <p className="font-body text-gray-500 text-lg leading-relaxed">
                        We're hiring passionate interns and team members to help us carry the sacred fragrance of Ayodhya
                        to homes across India and the world. Learn, grow, and build something meaningful with us.
                    </p>
                    <a
                        href={APPLY_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center gap-2 mt-8 px-10 py-4 text-xs uppercase tracking-widest"
                    >
                        Apply Now <ArrowRight size={16} />
                    </a>
                </div>

                <div className="rounded-sm overflow-hidden border border-gray-100 shadow-sm mb-20 max-w-2xl mx-auto">
                    <img
                        src="/images/ayodhya-agarbatti-hiring-interns-careers.png"
                        alt="Ayodhya Agarbatti is hiring interns - learn and grow, work on real projects, be part of a meaningful brand, gain practical experience"
                        className="w-full h-auto"
                        loading="eager"
                        width="1200"
                        height="1200"
                    />
                </div>

                {/* Perks */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
                    {perks.map((perk) => {
                        const Icon = perk.icon;
                        return (
                            <div key={perk.label} className="text-center px-4">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center text-terracotta">
                                    <Icon size={26} />
                                </div>
                                <p className="font-subheading text-xs uppercase tracking-wider text-charcoal font-bold">
                                    {perk.label}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Open Roles */}
                <div className="mb-24">
                    <h2 className="font-heading text-3xl text-charcoal mb-2 text-center">Current Openings</h2>
                    <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
                        Explore our open internship and job roles below. Don't see a perfect fit? Apply anyway and tell us how you'd like to contribute.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {openRoles.map((role) => {
                            const Icon = role.icon;
                            return (
                                <div
                                    key={role.title}
                                    className="border border-gray-100 rounded-sm p-8 hover:shadow-lg transition-shadow bg-gray-50/50"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 shrink-0 rounded-full bg-white border border-gray-100 flex items-center justify-center text-terracotta">
                                            <Icon size={22} />
                                        </div>
                                        <div>
                                            <h3 className="font-heading text-xl text-charcoal mb-1">{role.title}</h3>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-bold uppercase tracking-wider">
                                                <span className="flex items-center gap-1"><Clock size={12} /> {role.type}</span>
                                                <span className="flex items-center gap-1"><MapPin size={12} /> {role.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6">{role.description}</p>
                                    <a
                                        href={APPLY_FORM_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta hover:text-gold transition-colors"
                                    >
                                        Apply via Google Form <ArrowRight size={14} />
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto mb-20">
                    <h2 className="font-heading text-3xl text-charcoal mb-10 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {careersFaqs.map((faq) => (
                            <div key={faq.question} className="border-b border-gray-100 pb-6">
                                <h3 className="font-heading text-lg text-charcoal mb-2">{faq.question}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center bg-charcoal rounded-sm py-16 px-6">
                    <h2 className="font-heading text-3xl text-ivory mb-4">Ready to Join Us?</h2>
                    <p className="text-ivory/70 mb-8 max-w-xl mx-auto">
                        Submit your application through our Google Form and our HR team will get back to shortlisted candidates.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href={APPLY_FORM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center gap-2 px-10 py-4 text-xs uppercase tracking-widest"
                        >
                            Apply Now <ArrowRight size={16} />
                        </a>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 px-10 py-4 text-xs uppercase tracking-widest border border-ivory/30 text-ivory hover:bg-ivory/10 transition-colors"
                        >
                            <Mail size={16} /> Contact HR
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Careers;
