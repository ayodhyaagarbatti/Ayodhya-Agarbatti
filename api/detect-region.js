// Vercel's edge network stamps every request with the visitor's country before it
// ever reaches this function - no third-party geo-IP lookup needed. This is also the
// same signal that order-creation endpoints will trust when international checkout
// goes live, so what a visitor sees here matches what they'd actually be charged.
const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'private, max-age=0, no-store');
    res.end(JSON.stringify(payload));
};

export default async function handler(req, res) {
    const country = req.headers['x-vercel-ip-country'] || null;
    const isIndia = !country || country === 'IN'; // unknown origin (e.g. local dev) defaults to India
    sendJson(res, 200, { country, isIndia });
}
