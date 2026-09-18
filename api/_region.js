// Shared by detect-region.js (what the client displays) and every order-creation
// endpoint (what actually gets charged) - both must agree, or a visitor could see one
// price and be charged another. Vercel's edge stamps this header itself based on the
// request's real origin; a client can't override it by sending its own value.
export const isIndiaRequest = (req) => {
    const country = req.headers['x-vercel-ip-country'];
    return !country || country === 'IN';
};
