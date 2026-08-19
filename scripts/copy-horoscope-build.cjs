const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'horoscope-engine', 'index.html');
const destDir = path.join(__dirname, '..', 'public', 'horoscope-engine');
const dest = path.join(destDir, 'index.html');

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log('Copied horoscope-engine build to public/horoscope-engine/index.html');
