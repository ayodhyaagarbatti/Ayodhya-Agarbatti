export const products = [
    {
        id: 1,
        slug: "coffee-incense",
        name: "Espresso Ground Incense",
        variant: "Roasted Coffee & Dark Cocoa Blend",
        price: "₹299",
        numericPrice: 299,
        originalPrice: "₹500",
        discount: "40% OFF",
        category: "Focus & Energy",
        badge: "Best for Focus",
        rating: 4.9,
        reviewCount: 164,
        stickCount: "33 Hand-Rolled Sticks + Free Incense Holder",
        burnTime: "45-50 Minutes per Stick",
        scentStrength: 5,
        benefits: ["Sharpens Focus", "Mental Clarity", "Sustained Energy", "Zero Jitters"],
        shortDesc: "Stimulate your mind with the robust, roasted aroma of Ethiopian Arabica coffee beans and dark cocoa. Ideal for morning rituals, workspace concentration, and deep work.",
        story: "Sourced from high-altitude organic coffee estates and blended with sacred temple flowers in Ayodhya. The aroma is rich, earthy, and invigorating—stimulating focus and elevating alertness during meditation or high-cognition work.",
        pyramid: {
            top: "Sun-Dried Arabica & Roasted Espresso",
            heart: "Dark Cocoa Pods & Cardamom Spice",
            base: "Himalayan Vetiver & Cedarwood"
        },
        origin: "Ethiopian Highlands & Ayodhya Sanctuary",
        mood: "Intellectual Awakening & Deep Productivity",
        chakra: "Root (Muladhara) — Grounding & Stamina",
        bestTime: "Dawn, Morning Meditation, Work Hours",
        ingredients: [
            "100% Pure Sun-Dried Arabica Coffee Extract",
            "Sacred Ayodhya Temple Flower Powder",
            "Natural Tree Gum (Jigzat Resin)",
            "Pure Sandalwood Powder",
            "Zero Charcoal, 100% Non-Toxic & Charcoal-Free"
        ],
        images: ["/images/espresso.png", "/images/product_coffee.jpg"],
        packOptions: [
            { size: "Single Pack (33 Sticks)", price: 299, tag: "Standard" },
            { size: "Trio Value Pack (99 Sticks)", price: 799, tag: "Save 12%" },
            { size: "Sanctuary Gift Set (33 Sticks + Brass Burner)", price: 1299, tag: "Best Value" }
        ],
        faqs: [
            {
                question: "How many sticks are in one pack?",
                answer: "Each pack contains exactly 33 hand-rolled incense sticks, crafted with natural ingredients in Ayodhya."
            },
            {
                question: "Does Coffee incense contain caffeine?",
                answer: "No. The fragrance is derived from natural steam-distilled coffee essential oils and roasted botanical extracts."
            },
            {
                question: "Is this incense stick charcoal-free?",
                answer: "Yes, 100% charcoal-free. All Ayodhya Agarbatti sticks burn cleanly without dark soot."
            }
        ],
        reviews: [
            {
                id: 101,
                name: "Ananya Sharma",
                location: "New Delhi",
                rating: 5,
                date: "2026-06-18",
                comment: "The scent of Espresso Ground in my study every morning creates an incredible atmosphere of deep focus."
            },
            {
                id: 102,
                name: "Vikramaditya R.",
                location: "Bengaluru",
                rating: 5,
                date: "2026-07-02",
                comment: "Top notch quality. No smoke irritation, just divine roasted coffee and woody base notes."
            }
        ]
    },
    {
        id: 2,
        slug: "vanilla-incense",
        name: "Madagascan Calm Incense",
        variant: "French Vanilla & Botanical Pods",
        price: "₹299",
        numericPrice: 299,
        originalPrice: "₹500",
        discount: "40% OFF",
        category: "Relaxation & Sleep",
        badge: "Best Seller",
        rating: 5.0,
        reviewCount: 218,
        stickCount: "33 Hand-Rolled Sticks + Free Incense Holder",
        burnTime: "45-50 Minutes per Stick",
        scentStrength: 4,
        benefits: ["Stress Relief", "Deep Sleep", "Cortisol Reduction", "Inner Peace"],
        shortDesc: "A velvety, soothing blend of Madagascan bourbon vanilla, orchid petals, and warm tonka bean. Relieves anxiety and prepares the soul for peaceful rest.",
        story: "Crafted from hand-pollinated Madagascan vanilla pods and paired with sandalwood powders. Vanilla's natural vanillin molecule calms the senses, wrapping your space in warmth and comfort.",
        pyramid: {
            top: "Sweet Vanilla Cream & Blossom",
            heart: "Madagascan Orchid & Cinnamon Bark",
            base: "Warm Tonka Bean & Sacred Amber"
        },
        origin: "Sava Region (Madagascar) & Ayodhya",
        mood: "Deep Comfort, Safety & Emotional Healing",
        chakra: "Sacral (Swadhisthana) — Harmony & Calm",
        bestTime: "Evening Prayer, Dusk, Pre-Bedtime Sleep Rituals",
        ingredients: [
            "Pure Madagascan Vanilla Bean Powder",
            "Sacred Lotus Flower Petal Extract",
            "White Sandalwood Bark",
            "Natural Plant Resin Binder",
            "100% Charcoal-Free & Organic Oils"
        ],
        images: ["/images/vanilla.png", "/images/product_vanilla_group.jpg"],
        packOptions: [
            { size: "Single Pack (33 Sticks)", price: 299, tag: "Standard" },
            { size: "Trio Value Pack (99 Sticks)", price: 799, tag: "Save 12%" },
            { size: "Sanctuary Gift Set (33 Sticks + Brass Burner)", price: 1299, tag: "Best Value" }
        ],
        faqs: [
            {
                question: "How many sticks come in a pack?",
                answer: "Every pack includes 33 premium hand-rolled incense sticks along with a free incense holder."
            },
            {
                question: "Can I use Madagascan Calm before sleeping?",
                answer: "Yes, Madagascan Calm is ideal for evening relaxation and bedtime wind-down rituals."
            }
        ],
        reviews: [
            {
                id: 201,
                name: "Pooja Hegde",
                location: "Mumbai",
                rating: 5,
                date: "2026-06-25",
                comment: "Absolute bliss. Lighting Madagascan Calm after a long workday instantly melts my stress away."
            }
        ]
    },
    {
        id: 3,
        slug: "lemon-incense",
        name: "Citrus Clarity Incense",
        variant: "Amalfi Zest Lemon & Verbena",
        price: "₹299",
        numericPrice: 299,
        originalPrice: "₹450",
        discount: "33% OFF",
        category: "Purification & Cleansing",
        badge: "Pure Aura Cleansing",
        rating: 4.8,
        reviewCount: 129,
        stickCount: "33 Hand-Rolled Sticks + Free Incense Holder",
        burnTime: "45-50 Minutes per Stick",
        scentStrength: 5,
        benefits: ["Aura Purification", "Disperses Stagnant Smoke", "Uplifts Mood", "Clean Energy"],
        shortDesc: "Sharp, sparkling zest of Amalfi lemon infused with lemongrass and crisp cedar. Cuts through negative energy and neutralizes stale room odors instantly.",
        story: "Cold-pressed from sun-ripened lemon zest and combined with botanical leaves, Citrus Clarity floods your sanctuary with limonene terpenes, elevating mood and dispelling room stagnation.",
        pyramid: {
            top: "Sparkling Lemon Zest & Bergamot",
            heart: "Fresh Lemongrass & Spanish Verbena",
            base: "Clean Cedar & White Musk"
        },
        origin: "Amalfi Coast & Sacred Ayodhya Gardens",
        mood: "Energetic Purification & Vibrant Joy",
        chakra: "Solar Plexus (Manipura) — Vitality & Willpower",
        bestTime: "Morning Meditation, Room Cleansing, Workspace",
        ingredients: [
            "Cold-Pressed Amalfi Lemon Zest Oil",
            "Wild Lemongrass & Tulsi Powder",
            "Sacred Temple Flower Resins",
            "Natural Eco-Wood Powder",
            "100% Charcoal-Free"
        ],
        images: ["/images/lemon.png", "/images/product_lemon.jpg"],
        packOptions: [
            { size: "Single Pack (33 Sticks)", price: 299, tag: "Standard" },
            { size: "Trio Value Pack (99 Sticks)", price: 799, tag: "Save 12%" },
            { size: "Sanctuary Gift Set (33 Sticks + Brass Burner)", price: 1299, tag: "Best Value" }
        ],
        faqs: [
            {
                question: "How many sticks are included?",
                answer: "Each pack contains exactly 33 hand-rolled natural incense sticks."
            }
        ],
        reviews: [
            {
                id: 301,
                name: "Siddharth Verma",
                location: "Pune",
                rating: 5,
                date: "2026-05-30",
                comment: "So crisp and invigorating! Leaves the house smelling like a pristine luxury spa."
            }
        ]
    },
    {
        id: 4,
        slug: "orange-incense",
        name: "Creative Spark Incense",
        variant: "Nagpur Wild Orange & Sacred Tulsi",
        price: "₹299",
        numericPrice: 299,
        originalPrice: "₹450",
        discount: "33% OFF",
        category: "Joy & Creative Flow",
        badge: "Best for Artists",
        rating: 4.9,
        reviewCount: 97,
        stickCount: "33 Hand-Rolled Sticks + Free Incense Holder",
        burnTime: "45-50 Minutes per Stick",
        scentStrength: 4,
        benefits: ["Unlocks Creativity", "Sparks Joy", "Reduces Burnout", "Optimism"],
        shortDesc: "Vibrant wild orange, neroli blossoms, and warm sacred spices. Awakens creative energy centers, unleashing inspiration and joy.",
        story: "Wild Orange connects us to joyful creative expression. Combined with organic Neroli blossoms and holy Tulsi leaves, Creative Spark dissolves blockages and promotes flow state.",
        pyramid: {
            top: "Sweet Wild Mandarin & Orange Peel",
            heart: "Neroli Blossom & Sacred Tulsi",
            base: "Cinnamon Bark & Golden Frankincense"
        },
        origin: "Nagpur & Ayodhya Holy Gardens",
        mood: "Joyful Flow & Creative Inspiration",
        chakra: "Sacral (Swadhisthana) & Heart (Anahata)",
        bestTime: "Art Studio, Writing, Brainstorming, Music Sessions",
        ingredients: [
            "Nagpur Orange Blossom & Peel Extract",
            "Sacred Holy Basil (Tulsi) Leaf Powder",
            "Natural Plant Gums & Resins",
            "Pure Bamboo-Free Natural Base",
            "100% Charcoal-Free"
        ],
        images: ["/images/orange.png", "/images/product_orange.jpg"],
        packOptions: [
            { size: "Single Pack (33 Sticks)", price: 299, tag: "Standard" },
            { size: "Trio Value Pack (99 Sticks)", price: 799, tag: "Save 12%" },
            { size: "Sanctuary Gift Set (33 Sticks + Brass Burner)", price: 1299, tag: "Best Value" }
        ],
        faqs: [
            {
                question: "How many sticks are in one pack?",
                answer: "Each pack comes with 33 hand-rolled incense sticks."
            }
        ],
        reviews: [
            {
                id: 401,
                name: "Kavita Nair",
                location: "Hyderabad",
                rating: 5,
                date: "2026-06-14",
                comment: "Creative Spark sets the exact ambient frequency for my studio work."
            }
        ]
    }
];

export const categories = [
    "All Incense",
    "Focus & Energy",
    "Relaxation & Sleep",
    "Purification & Cleansing",
    "Joy & Creative Flow"
];
