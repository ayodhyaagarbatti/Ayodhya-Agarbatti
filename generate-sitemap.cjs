const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.ayodhyaagarbatti.in';
const OUTPUT_PATH = path.join(__dirname, 'public', 'sitemap.xml');

const products = [
    { id: 1, slug: 'coffee-incense', lastmod: '2026-07-25', changefreq: 'weekly', priority: 0.9 },
    { id: 2, slug: 'vanilla-incense', lastmod: '2026-07-25', changefreq: 'weekly', priority: 0.9 },
    { id: 3, slug: 'lemon-incense', lastmod: '2026-07-25', changefreq: 'weekly', priority: 0.9 },
    { id: 4, slug: 'orange-incense', lastmod: '2026-07-25', changefreq: 'weekly', priority: 0.9 }
];

const staticRoutes = [
    { path: '/', lastmod: '2026-07-25', changefreq: 'daily', priority: 1.0 },
    { path: '/shop', lastmod: '2026-07-25', changefreq: 'daily', priority: 0.9 },
    { path: '/blog', lastmod: '2026-07-25', changefreq: 'weekly', priority: 0.8 },
    { path: '/contact', lastmod: '2026-07-25', changefreq: 'monthly', priority: 0.7 },
    { path: '/return-policy', lastmod: '2026-07-25', changefreq: 'monthly', priority: 0.6 },
    { path: '/checkout', lastmod: '2026-07-25', changefreq: 'yearly', priority: 0.3 },
    { path: '/success', lastmod: '2026-07-25', changefreq: 'yearly', priority: 0.3 }
];

const imageMap = {
    'coffee-incense': '/images/espresso.png',
    'vanilla-incense': '/images/vanilla.png',
    'lemon-incense': '/images/lemon.png',
    'orange-incense': '/images/orange.png'
};

const productTitles = {
    'coffee-incense': 'Espresso Ground Incense - Coffee & Dark Cocoa',
    'vanilla-incense': 'Madagascan Calm Incense - Vanilla & Tonka Bean',
    'lemon-incense': 'Citrus Clarity Incense - Amalfi Lemon & Verbena',
    'orange-incense': 'Creative Spark Incense - Wild Orange & Tulsi'
};

function generateSitemap() {
    const today = new Date().toISOString().split('T')[0];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n';

    staticRoutes.forEach(route => {
        const url = `${BASE_URL}${route.path}`;
        xml += '  <url>\n';
        xml += `    <loc>${url}</loc>\n`;
        xml += `    <lastmod>${route.lastmod}</lastmod>\n`;
        xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
        xml += `    <priority>${route.priority}</priority>\n`;
        
        xml += '    <xhtml:link rel="alternate" hreflang="en" href="' + url + '" />\n';
        xml += '    <xhtml:link rel="alternate" hreflang="hi" href="' + url + '" />\n';
        xml += '    <xhtml:link rel="alternate" hreflang="x-default" href="' + url + '" />\n';
        
        if (route.path === '/') {
            xml += '    <image:image>\n';
            xml += `      <image:loc>${BASE_URL}/images/ayodhya_logo.png</image:loc>\n`;
            xml += '      <image:title>Ayodhya Agarbatti Logo</image:title>\n';
            xml += '      <image:caption>Premium hand-rolled incense from Ayodhya</image:caption>\n';
            xml += '    </image:image>\n';
        }
        xml += '  </url>\n\n';
    });

    products.forEach(product => {
        const url = `${BASE_URL}/product/${product.id}`;
        const imageUrl = `${BASE_URL}${imageMap[product.slug]}`;
        const title = productTitles[product.slug];
        
        xml += '  <url>\n';
        xml += `    <loc>${url}</loc>\n`;
        xml += `    <lastmod>${product.lastmod}</lastmod>\n`;
        xml += `    <changefreq>${product.changefreq}</changefreq>\n`;
        xml += `    <priority>${product.priority}</priority>\n`;
        
        xml += '    <xhtml:link rel="alternate" hreflang="en" href="' + url + '" />\n';
        xml += '    <xhtml:link rel="alternate" hreflang="hi" href="' + url + '" />\n';
        xml += '    <xhtml:link rel="alternate" hreflang="x-default" href="' + url + '" />\n';
        
        xml += '    <image:image>\n';
        xml += `      <image:loc>${imageUrl}</image:loc>\n`;
        xml += `      <image:title>${title}</image:title>\n`;
        xml += `      <image:caption>${title} - Hand-rolled in Ayodhya</image:caption>\n`;
        xml += '    </image:image>\n';
        xml += '  </url>\n\n';
    });

    xml += '</urlset>';

    fs.writeFileSync(OUTPUT_PATH, xml);
    console.log(`Sitemap generated at ${OUTPUT_PATH}`);
    console.log(`Total URLs: ${staticRoutes.length + products.length}`);
}

generateSitemap();