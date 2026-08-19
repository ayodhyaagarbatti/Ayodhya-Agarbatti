import crypto from 'crypto';

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export const signSession = (secret) => {
    const expires = Date.now() + SESSION_TTL_MS;
    const signature = crypto.createHmac('sha256', secret).update(String(expires)).digest('hex');
    return `${expires}.${signature}`;
};

export const verifySession = (token, secret) => {
    if (!token || !secret) return false;
    const [expiresStr, signature] = String(token).split('.');
    const expires = Number(expiresStr);
    if (!expires || !signature || Date.now() > expires) return false;

    const expected = crypto.createHmac('sha256', secret).update(String(expires)).digest('hex');
    try {
        const a = Buffer.from(expected, 'hex');
        const b = Buffer.from(signature, 'hex');
        return a.length === b.length && crypto.timingSafeEqual(a, b);
    } catch {
        return false;
    }
};
