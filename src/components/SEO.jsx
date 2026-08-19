import React, { useEffect } from 'react';

const generateHreflangLinks = (canonical) => {
    const baseUrl = 'https://www.ayodhyaagarbatti.in';
    const path = canonical.replace(baseUrl, '') || '/';
    return [
        { hreflang: 'en', href: `${baseUrl}${path}` },
        { hreflang: 'hi', href: `${baseUrl}${path}` },
        { hreflang: 'x-default', href: `${baseUrl}${path}` }
    ];
};

const createSchemaScript = (id, schema) => {
    let scriptTag = document.getElementById(id);
    if (schema) {
        if (!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.id = id;
            scriptTag.type = 'application/ld+json';
            document.head.appendChild(scriptTag);
        }
        scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
        scriptTag.remove();
    }
};

const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ayodhya Agarbatti",
    "alternateName": "अयोध्या अगरबत्ती",
    "url": "https://www.ayodhyaagarbatti.in",
    "logo": "https://www.ayodhyaagarbatti.in/images/ayodhya_logo.png",
    "sameAs": [
        "https://www.instagram.com/ayodhyaagarbatti/",
        "https://www.facebook.com/ayodhyaagarbatti",
        "https://www.linkedin.com/in/ayodhya-agarbatti-122b22418/",
        "https://www.youtube.com/@ayodhyaagarbatti"
    ],
    "contactPoint": {
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
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ayodhya",
        "addressRegion": "Uttar Pradesh",
        "addressCountry": "IN"
    },
    "foundingLocation": {
        "@type": "Place",
        "name": "Ayodhya, Uttar Pradesh, India"
    },
    "brand": {
        "@type": "Brand",
        "name": "Ayodhya Agarbatti"
    }
};

const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ayodhya Agarbatti",
    "alternateName": "अयोध्या अगरबत्ती",
    "url": "https://www.ayodhyaagarbatti.in",
    "potentialAction": {
        "@type": "SearchAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.ayodhyaagarbatti.in/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
    },
    "inLanguage": ["en", "hi"],
    "publisher": {
        "@id": "https://www.ayodhyaagarbatti.in/#organization"
    }
};

const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.ayodhyaagarbatti.in/#localbusiness",
    "name": "Ayodhya Agarbatti",
    "alternateName": "अयोध्या अगरबत्ती",
    "description": "Premium 100% natural, charcoal-free incense sticks hand-rolled in the holy city of Ayodhya using sacred temple flowers, Mysore sandalwood, and therapeutic essential oils.",
    "url": "https://www.ayodhyaagarbatti.in",
    "telephone": "+91-98765-43210",
    "email": "namaste@ayodhyaagarbatti.com",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Temple Road",
        "addressLocality": "Ayodhya",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "224001",
        "addressCountry": "IN"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": "26.7962",
        "longitude": "82.1994"
    },
    "openingHoursSpecification": [
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "18:00",
            "timeZone": "Asia/Kolkata"
        }
    ],
    "priceRange": "₹299 - ₹1299",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, Credit Card, UPI, Razorpay, COD",
    "areaServed": {
        "@type": "Country",
        "name": "India"
    },
    "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Sacred Incense Collection",
        "itemListElement": [
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Product",
                    "name": "Espresso Ground Incense - Coffee & Dark Cocoa",
                    "description": "Stimulate your mind with the robust, roasted aroma of Ethiopian Arabica coffee beans and dark cocoa."
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Product",
                    "name": "Madagascan Calm Incense - Vanilla & Tonka Bean",
                    "description": "A velvety, soothing blend of Madagascan bourbon vanilla, orchid petals, and warm tonka bean."
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Product",
                    "name": "Citrus Clarity Incense - Amalfi Lemon & Verbena",
                    "description": "Sharp, sparkling zest of Amalfi lemon infused with lemongrass and crisp cedar."
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Product",
                    "name": "Creative Spark Incense - Wild Orange & Tulsi",
                    "description": "Vibrant wild orange, neroli blossoms, and warm sacred spices for creative flow."
                }
            }
        ]
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "608",
        "bestRating": "5",
        "worstRating": "1"
    }
};

const breadcrumbSchema = (breadcrumbs) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
    }))
});

const faqSchema = (faqs) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
        }
    }))
});

const SEO = ({
    title = "Ayodhya Agarbatti | Pure Sacred Incense Sticks Hand-Rolled in Ayodhya",
    description = "Experience 100% natural, charcoal-free premium incense sticks hand-rolled in the holy city of Ayodhya. Sourced from organic temple flowers, pure Mysore sandalwood, and therapeutic essential oils.",
    keywords = "Ayodhya Agarbatti, natural incense sticks, charcoal free agarbatti, Mysore sandalwood incense, temple flower agarbatti, organic incense sticks India, luxury agarbatti, pooja incense, Ayodhya incense online buy, buy agarbatti online India",
    canonical = "https://www.ayodhyaagarbatti.in/",
    ogImage = "https://www.ayodhyaagarbatti.in/images/ayodhya_package.png",
    ogType = "website",
    schema = null,
    breadcrumbs = null,
    faqs = null,
    locale = "en_IN",
    alternateLocales = ["hi_IN"]
}) => {
    useEffect(() => {
        document.title = title;

        const setMeta = (attrName, attrValue, content) => {
            let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attrName, attrValue);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        const removeMeta = (attrName, attrValue) => {
            const element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
            if (element) element.remove();
        };

        setMeta('name', 'description', description);
        setMeta('name', 'keywords', keywords);
        setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
        setMeta('name', 'viewport', 'width=device-width, initial-scale=1');
        setMeta('name', 'theme-color', '#1a1a1a');
        setMeta('name', 'format-detection', 'telephone=yes');
        setMeta('name', 'geo.region', 'IN-UP');
        setMeta('name', 'geo.placename', 'Ayodhya');
        setMeta('name', 'geo.position', '26.7962;82.1994');
        setMeta('name', 'ICBM', '26.7962, 82.1994');
        setMeta('property', 'og:locale', locale);
        alternateLocales.forEach(alt => setMeta('property', 'og:locale:alternate', alt));
        setMeta('property', 'og:title', title);
        setMeta('property', 'og:description', description);
        setMeta('property', 'og:type', ogType);
        setMeta('property', 'og:url', canonical);
        setMeta('property', 'og:image', ogImage);
        setMeta('property', 'og:image:width', '1200');
        setMeta('property', 'og:image:height', '630');
        setMeta('property', 'og:image:alt', 'Ayodhya Agarbatti Premium Incense Collection');
        setMeta('property', 'og:site_name', 'Ayodhya Agarbatti');

        setMeta('name', 'twitter:card', 'summary_large_image');
        setMeta('name', 'twitter:title', title);
        setMeta('name', 'twitter:description', description);
        setMeta('name', 'twitter:image', ogImage);
        setMeta('name', 'twitter:image:alt', 'Ayodhya Agarbatti Premium Incense Collection');

        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', canonical);

        const hreflangs = generateHreflangLinks(canonical);
        hreflangs.forEach(({ hreflang, href }) => {
            let link = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', 'alternate');
                link.setAttribute('hreflang', hreflang);
                document.head.appendChild(link);
            }
            link.setAttribute('href', href);
        });

        createSchemaScript('org-schema', organizationSchema);
        createSchemaScript('website-schema', websiteSchema);
        createSchemaScript('localbusiness-schema', localBusinessSchema);

        if (breadcrumbs) {
            createSchemaScript('breadcrumb-schema', breadcrumbSchema(breadcrumbs));
        } else {
            const existing = document.getElementById('breadcrumb-schema');
            if (existing) existing.remove();
        }

        if (faqs) {
            createSchemaScript('faq-schema', faqSchema(faqs));
        } else {
            const existing = document.getElementById('faq-schema');
            if (existing) existing.remove();
        }

        if (schema) {
            createSchemaScript('dynamic-page-schema', schema);
        } else {
            const existing = document.getElementById('dynamic-page-schema');
            if (existing) existing.remove();
        }
    }, [title, description, keywords, canonical, ogImage, ogType, schema, breadcrumbs, faqs, locale, alternateLocales]);

    return null;
};

export { SEO, organizationSchema, websiteSchema, localBusinessSchema, breadcrumbSchema, faqSchema };
export default SEO;
