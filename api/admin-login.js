import readJsonBody from './_readJsonBody.js';
import { signSession } from './_adminSession.js';

const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed' });
        return;
    }

    let body;
    try {
        body = await readJsonBody(req);
    } catch (err) {
        sendJson(res, 400, { error: 'Invalid JSON body' });
        return;
    }

    const validPassword = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;
    if (!validPassword || !sessionSecret) {
        sendJson(res, 500, { error: 'Admin login is not configured on the server. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET.' });
        return;
    }

    if (body.password !== validPassword) {
        sendJson(res, 401, { error: 'Invalid credentials. Access denied.' });
        return;
    }

    sendJson(res, 200, { token: signSession(sessionSecret) });
}
