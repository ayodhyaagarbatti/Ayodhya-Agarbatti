import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            // TopBar
            topBar: "✨ Hand-Rolled in Ayodhya • 100% Charcoal-Free",
            freeShipping: "Complimentary Shipping on Orders Over ₹999",

            // Navbar
            navHome: "Home",
            navShop: "Shop",
            navRituals: "Rituals",
            navJournal: "Journal",
            navContact: "Contact",
            navAdmin: "Admin",

            // Hero
            heroTagline: "Handcrafted in the Holy City",
            heroTitle1: "Sacred",
            heroTitle2: "Aroma",
            heroSubtitle: "Experience the divine fragrance of Ayodhya.",
            heroSubtitleItalic: "Where prayer meets purity.",
            heroShopBtn: "Shop Collection",
            heroRitualsBtn: "Our Rituals",
            heroDiscover: "Discover",

            // TrustBar
            trust1Title: "100% Natural",
            trust1Desc: "Plant-based ingredients",
            trust2Title: "Temple Grade",
            trust2Desc: "Hand-rolled clarity",
            trust3Title: "Ethically Sourced",
            trust3Desc: "Fair trade practices",
            trust4Title: "Essential Oils",
            trust4Desc: "Therapeutic purity",

            // Marquee
            marquee1: "Pure Ingredients",
            marquee2: "Handcrafted in Ayodhya",
            marquee3: "Divine Fragrance",
            marquee4: "Ethically Sourced",
            marquee5: "Luxury Aromatherapy",

            // Home page sections
            ourHeritage: "Our Heritage",
            heritageQuote: "\"Rooted in the holy city of Ayodhya, crafting fragrances that bridge the mortal and the divine.\"",
            theRitual: "The Ritual",
            ritualHeading1: "Connecting Soul",
            ritualHeading2: "to Divinity",
            ritualQuote: "\"Incense is not just fragrance; it is a bridge between the mortal and the divine. Every stick we hand-roll in Ayodhya carries a prayer, a wish, and a moment of peace.\"",

            // Product Section
            royalCollection: "The Royal Collection",
            sacredFragrances: "Sacred Fragrances",
            handRolled: "Hand-Rolled in Ayodhya",
            sortFeatured: "Featured",
            sortPriceLow: "Price: Low to High",
            sortPriceHigh: "Price: High to Low",
            sortRating: "Highest Rated",
            topNote: "Top Note:",
            baseNote: "Base Note:",
            taxIncluded: "Tax Included",
            quickAdd: "Quick Add",
            viewRitual: "View Ritual",
            addedToSanctuary: "Added to Sanctuary Bag",
            fragrancePyramid: "Fragrance Pyramid",
            pyramidTop: "TOP",
            pyramidHeart: "HEART",
            pyramidBase: "BASE",
            addToSanctuary: "Add to Sanctuary",
            fullDetails: "Full Details",
            allIncense: "All Incense",

            // Cart
            yourBag: "Your Bag",
            items: "items",
            soulWaiting: "Your soul is waiting for a scent...",
            continueShopping: "Continue Shopping",
            totalEstimate: "Total Estimate",
            proceedToCheckout: "Proceed to Checkout",

            // Checkout / Payment
            shippingAddress: "Shipping Address",
            reviewOrder: "Review Order",
            selectPayment: "Select Payment Method",
            placeOrder: "Place Order",
            payWithRazorpay: "Pay Online with Razorpay",
            cashOnDelivery: "Cash on Delivery (COD)",

            // RitualGuide
            theExperience: "The Experience",
            elevateHeading1: "Elevate the",
            elevateHeading2: "Everyday",
            ritualDesc: "In a world of noise, the lighting of incense is a radical act of slowing down. It is a signal to the brain that the hustle has ceased, and the sanctuary is open.",
            step1Title: "01. Intention",
            step1Desc: "Hold the stick for a moment before lighting. Set a silent intention for your space.",
            step2Title: "02. Ignition",
            step2Desc: "Light the tip. Allow the flame to dance for 5 seconds before gently blowing it out.",
            step3Title: "03. Transformation",
            step3Desc: "Place in a holder specifically designed for ash collection. Breathe deep as the smoke rises.",

            // Fragrance Philosophy
            ourFormulation: "Our Formulation",
            scienceHeading1: "The Science of",
            scienceHeading2: "Sacred Scent",
            scienceDesc: "We define luxury through purity. Our \"Nose\" curates only superior grade botanicals, ensuring every stick burns with a clean, complex, and persistent aroma structure.",
            phil1Title: "Botanical Integrity",
            phil1Desc: "We refuse synthetic binders. Our base is pure bamboo, charcoal, and organic wood powders.",
            phil2Title: "Essential Extraction",
            phil2Desc: "Oils derived from steam distillation to preserve the therapeutic properties of the plant soul.",
            phil3Title: "Aero-Diffusion",
            phil3Desc: "Engineered for slow-release diffusion, filling large spaces without overwhelming the senses.",
            phil4Title: "Vibrational Match",
            phil4Desc: "Each formula is frequency-tested to align with specific energetic states (calm, focus, flow).",

            // Footer
            footerBrandDesc: "Crafting 100% natural, charcoal-free sacred fragrances. Hand-rolled in the holy city of Ayodhya.",
            footerCollection: "Collection",
            footerCompany: "Company & Legal",
            footerNewsletter: "Newsletter",
            footerNewsletterDesc: "Join our circle. Receive ritual guides and exclusive launches.",
            footerEmailPlaceholder: "Email Address",
            footerJoin: "Join",
            footerJoining: "Saving...",
            footerSubscribed: "Subscribed to database successfully!",
            footerOurStory: "Our Story",
            footerJournal: "Journal",
            footerContact: "Contact Us",
            footerReturnPolicy: "Return & Refund Policy",
            footerAdminAccess: "Admin Access",
            footerRights: "All rights reserved.",
        }
    },
    hi: {
        translation: {
            // TopBar
            topBar: "✨ पवित्र अयोध्या में हस्त-निर्मित • 100% कोयला-मुक्त",
            freeShipping: "₹999 से अधिक के ऑर्डर पर मुफ्त शिपिंग",

            // Navbar
            navHome: "होम",
            navShop: "दुकान",
            navRituals: "अनुष्ठान",
            navJournal: "पत्रिका",
            navContact: "संपर्क करें",
            navAdmin: "एडमिन",

            // Hero
            heroTagline: "पवित्र शहर में हस्तनिर्मित",
            heroTitle1: "पवित्र",
            heroTitle2: "सुगंध",
            heroSubtitle: "अयोध्या की दिव्य सुगंध का अनुभव करें।",
            heroSubtitleItalic: "जहां प्रार्थना और शुद्धता का मिलन होता है।",
            heroShopBtn: "संग्रह देखें",
            heroRitualsBtn: "हमारे अनुष्ठान",
            heroDiscover: "खोजें",

            // TrustBar
            trust1Title: "100% प्राकृतिक",
            trust1Desc: "पौधे-आधारित सामग्री",
            trust2Title: "मंदिर श्रेणी",
            trust2Desc: "हस्त-निर्मित शुद्धता",
            trust3Title: "नैतिक रूप से प्राप्त",
            trust3Desc: "उचित व्यापार प्रथाएं",
            trust4Title: "आवश्यक तेल",
            trust4Desc: "चिकित्सीय शुद्धता",

            // Marquee
            marquee1: "शुद्ध सामग्री",
            marquee2: "अयोध्या में हस्तनिर्मित",
            marquee3: "दिव्य सुगंध",
            marquee4: "नैतिक रूप से प्राप्त",
            marquee5: "विलासितापूर्ण अरोमाथेरेपी",

            // Home page sections
            ourHeritage: "हमारी विरासत",
            heritageQuote: "\"पवित्र अयोध्या में जड़ें जमाकर, ऐसी सुगंध तैयार करना जो नश्वर और दिव्य के बीच सेतु बने।\"",
            theRitual: "अनुष्ठान",
            ritualHeading1: "आत्मा को जोड़ना",
            ritualHeading2: "दिव्यता से",
            ritualQuote: "\"अगरबत्ती केवल सुगंध नहीं है; यह नश्वर और दिव्य के बीच एक सेतु है। अयोध्या में हमारे हाथों से बनी हर लाठी में एक प्रार्थना, एक इच्छा और शांति का एक पल होता है।\"",

            // Product Section
            royalCollection: "शाही संग्रह",
            sacredFragrances: "पवित्र अगरबत्तियां",
            handRolled: "अयोध्या में हस्त-निर्मित",
            sortFeatured: "विशेष रुप से प्रदर्शित",
            sortPriceLow: "कीमत: कम से ज़्यादा",
            sortPriceHigh: "कीमत: ज़्यादा से कम",
            sortRating: "सर्वोच्च रेटेड",
            topNote: "शीर्ष नोट:",
            baseNote: "बेस नोट:",
            taxIncluded: "कर शामिल",
            quickAdd: "जल्दी जोड़ें",
            viewRitual: "अनुष्ठान देखें",
            addedToSanctuary: "आपके झोले में जोड़ा गया",
            fragrancePyramid: "सुगंध पिरामिड",
            pyramidTop: "शीर्ष",
            pyramidHeart: "हृदय",
            pyramidBase: "आधार",
            addToSanctuary: "झोले में जोड़ें",
            fullDetails: "पूरी जानकारी",
            allIncense: "सभी अगरबत्ती",

            // Cart
            yourBag: "आपका झोला",
            items: "वस्तुएं",
            soulWaiting: "आपकी आत्मा एक सुगंध की प्रतीक्षा में है...",
            continueShopping: "खरीदारी जारी रखें",
            totalEstimate: "कुल अनुमानित मूल्य",
            proceedToCheckout: "चेकआउट के लिए आगे बढ़ें",

            // Checkout / Payment
            shippingAddress: "डिलीवरी का पता",
            reviewOrder: "ऑर्डर की समीक्षा करें",
            selectPayment: "भुगतान का तरीका चुनें",
            placeOrder: "ऑर्डर दें",
            payWithRazorpay: "ऑनलाइन रेज़रपे द्वारा भुगतान करें",
            cashOnDelivery: "कैश ऑन डिलीवरी (COD)",

            // RitualGuide
            theExperience: "अनुभव",
            elevateHeading1: "दैनिक जीवन को",
            elevateHeading2: "ऊंचा उठाएं",
            ritualDesc: "शोर से भरी दुनिया में, अगरबत्ती जलाना एक क्रांतिकारी कार्य है। यह मस्तिष्क को संकेत देता है कि जल्दबाजी थम गई है और अभयारण्य खुला है।",
            step1Title: "01. संकल्प",
            step1Desc: "जलाने से पहले एक पल के लिए लाठी थामें। अपने स्थान के लिए एक मौन संकल्प लें।",
            step2Title: "02. प्रज्वलन",
            step2Desc: "सिरे को जलाएं। ध्यान से फूंक मारने से पहले लौ को 5 सेकंड तक नाचने दें।",
            step3Title: "03. रूपांतरण",
            step3Desc: "राख संग्रह के लिए विशेष रूप से डिज़ाइन किए गए होल्डर में रखें। धुएं के उठते ही गहरी सांस लें।",

            // Fragrance Philosophy
            ourFormulation: "हमारा फ़ॉर्मूला",
            scienceHeading1: "पवित्र सुगंध का",
            scienceHeading2: "विज्ञान",
            scienceDesc: "हम शुद्धता के माध्यम से विलासिता को परिभाषित करते हैं। हमारा \"नाक\" केवल उच्च श्रेणी के वनस्पति सामग्री को चुनता है, यह सुनिश्चित करता है कि हर लाठी स्वच्छ, जटिल और स्थायी सुगंध संरचना के साथ जले।",
            phil1Title: "वानस्पतिक अखंडता",
            phil1Desc: "हम सिंथेटिक बाइंडर से इनकार करते हैं। हमारा आधार शुद्ध बांस, लकड़ी का कोयला और कार्बनिक लकड़ी के पाउडर हैं।",
            phil2Title: "आवश्यक निष्कर्षण",
            phil2Desc: "पौधे की आत्मा के चिकित्सीय गुणों को संरक्षित करने के लिए भाप आसवन से प्राप्त तेल।",
            phil3Title: "वायु-प्रसार",
            phil3Desc: "इंद्रियों को अभिभूत किए बिना बड़े स्थानों को भरने के लिए धीमी-रिलीज प्रसार के लिए इंजीनियर।",
            phil4Title: "कंपन मिलान",
            phil4Desc: "प्रत्येक फ़ॉर्मूला विशिष्ट ऊर्जावान अवस्थाओं (शांति, फोकस, प्रवाह) के साथ संरेखित करने के लिए आवृत्ति-परीक्षण किया जाता है।",

            // Footer
            footerBrandDesc: "100% प्राकृतिक, कोयला-मुक्त पवित्र सुगंध तैयार करना। अयोध्या की पवित्र नगरी में हस्त-निर्मित।",
            footerCollection: "संग्रह",
            footerCompany: "कंपनी और कानूनी",
            footerNewsletter: "न्यूज़लेटर",
            footerNewsletterDesc: "हमारे मंडल में शामिल हों। अनुष्ठान गाइड और विशेष लॉन्च प्राप्त करें।",
            footerEmailPlaceholder: "ईमेल पता",
            footerJoin: "जुड़ें",
            footerJoining: "सहेज रहा है...",
            footerSubscribed: "डेटाबेस में सफलतापूर्वक सदस्यता ली!",
            footerOurStory: "हमारी कहानी",
            footerJournal: "पत्रिका",
            footerContact: "संपर्क करें",
            footerReturnPolicy: "वापसी और धनवापसी नीति",
            footerAdminAccess: "एडमिन एक्सेस",
            footerRights: "सर्वाधिकार सुरक्षित।",
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('ayodhya_lang') || 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
