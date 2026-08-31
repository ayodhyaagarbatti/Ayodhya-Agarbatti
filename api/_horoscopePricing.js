import { horoscopeProducts } from '../src/data/horoscopeProducts.js';

const COUPONS = {
    WEKNOWTHEOWNER: { amountPaise: 1000 } // ₹10 flat, horoscope only
};

// Server is the sole source of truth for what a horoscope reading costs -
// never trust a price the browser sends. Coupon codes are validated here too,
// so a client can't apply a discount it wasn't actually granted.
export const computeHoroscopePrice = (productId, couponCode) => {
    const product = horoscopeProducts.find((p) => p.id === productId);
    if (!product) {
        throw new Error(`Unknown horoscope product: ${productId}`);
    }

    const normalizedCoupon = couponCode ? String(couponCode).trim().toUpperCase() : '';
    const coupon = normalizedCoupon ? COUPONS[normalizedCoupon] : null;

    const amountPaise = coupon ? coupon.amountPaise : product.price * 100;

    return {
        amountPaise,
        couponApplied: Boolean(coupon),
        productName: product.name,
        basePriceRupees: product.price
    };
};
