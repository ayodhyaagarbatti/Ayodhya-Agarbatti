// Unambiguous alphabet - no 0/O or 1/I - so a code read aloud or handwritten stays unambiguous.
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const generateReferralCode = () => {
    let code = '';
    for (let i = 0; i < 7; i++) {
        code += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return code;
};
