import { isIndiaRequest } from './_region.js';

// Vercel's edge network stamps every request with the visitor's country before it
// ever reaches this function - no third-party geo-IP lookup needed. isIndiaRequest()
// is the same check order-creation endpoints use, so what a visitor sees here matches
// what they're actually charged.
const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'private, max-age=0, no-store');
    res.end(JSON.stringify(payload));
};

export default async function handler(req, res) {
    const country = req.headers['x-vercel-ip-country'] || null;
    sendJson(res, 200, { country, isIndia: isIndiaRequest(req) });
}
