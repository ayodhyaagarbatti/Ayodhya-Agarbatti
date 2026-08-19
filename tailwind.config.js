/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                heading: ['Cinzel', 'serif'],
                subheading: ['Montserrat', 'sans-serif'],
                body: ['Outfit', 'sans-serif'],
                cursive: ['Dancing Script', 'cursive'],
                serif: ['Playfair Display', 'serif'],
            },
            colors: {
                charcoal: '#2C0E0E', // Royal Deep Maroon (Sandalwood) - Replaces Black
                'rich-black': '#1A0505', // Very Dark Warm Maroon (Not Black)
                'charcoal-dark': '#100202', // Deepest Red/Brown
                ivory: '#FDFBF7',
                gold: '#D4AF37',
                'gold-light': '#F4E09E',
                'warm-grey': '#8C7B75', // Warm Taupe
                terracotta: '#C25E45',
                teal: '#04383F',
                sandalwood: '#8B3A3A',
                'deep-forest': '#1A2F23',
                saffron: '#FF9933',
            }
        },
    },
    plugins: [],
}
