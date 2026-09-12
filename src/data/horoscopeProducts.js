// Catalog of paid horoscope readings offered on the site. `mode` maps directly
// to the horoscope engine's own appMode ('single' = one chart, 'match' = two
// charts compared) - see horoscope-engine/src/ui.js setMode().
export const horoscopeProducts = [
    {
        id: 'janma-kundali',
        mode: 'single',
        name: 'Janma Kundali',
        shortName: 'Life Horoscope',
        price: 99,
        usdPrice: 49,
        tagline: 'Your complete Vedic birth chart - career, marriage, health, timing and remedies.',
        includes: [
            '30-section Janma Kundali report',
            'North & South Indian Rāśi charts + 15 divisional charts',
            'Career, finance, marriage & foreign travel indications',
            'Vimśottari daśā timeline to three levels',
            'Yogas, doshas & remedies',
            'Downloadable branded PDF'
        ]
    },
    {
        id: 'marriage-match',
        mode: 'match',
        name: 'Marriage Compatibility',
        shortName: 'Guṇa Milan',
        price: 149,
        usdPrice: 99,
        tagline: 'The full 36-point Ashtakoota match for two birth charts, with dosha analysis.',
        includes: [
            '8-section Ashtakoota (36-point) Guṇa Milan',
            'Nāḍī & Bhakūṭa dosha gates with cancellation rules',
            'Navāṁśa (D-9) cross-read for both charts',
            'Area-by-area compatibility scores',
            'Daśā & timing overlap for both charts',
            'Downloadable branded PDF'
        ]
    }
];

export const getHoroscopeProduct = (id) => horoscopeProducts.find((p) => p.id === id);
