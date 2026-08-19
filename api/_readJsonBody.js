// Vercel's Node runtime already parses JSON bodies onto req.body. Our local dev
// middleware (vite.config.js) serves the same handler over a raw Node req/res,
// so this reads the stream by hand when req.body isn't already there.
export default function readJsonBody(req) {
    if (req.body !== undefined) return Promise.resolve(req.body);
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => { data += chunk; });
        req.on('end', () => {
            try {
                resolve(data ? JSON.parse(data) : {});
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });
}
