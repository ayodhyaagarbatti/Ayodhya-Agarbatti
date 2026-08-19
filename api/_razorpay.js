import Razorpay from 'razorpay';

// Server-only: RAZORPAY_KEY_SECRET must never be read by client code / VITE_-prefixed vars.
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export default razorpay;
