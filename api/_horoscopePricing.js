import { horoscopeProducts } from '../src/data/horoscopeProducts.js';

const COUPONS = {
    WEKNOWTHEOWNER: { amountPaise: 1000 } // ₹10 flat, horoscope only, India only - see below
};

// Server is the sole source of truth for what a horoscope reading costs -
// never trust a price the browser sends. Coupon codes are validated here too,
// so a client can't apply a discount it wasn't actually granted.
//
// International prices (usdPrice) are flat launch pricing, not a live INR/USD
// conversion, and coupons are INR-only - they never apply to USD orders.
export const computeHoroscopePrice = (productId, couponCode, isIndia = true) => {
    const product = horoscopeProducts.find((p) => p.id === productId);
    if (!product) {
        throw new Error(`Unknown horoscope product: ${productId}`);
    }

    if (!isIndia) {
        return {
            amountPaise: product.usdPrice * 100,
            couponApplied: false,
            productName: product.name,
            basePriceRupees: product.price,
            currency: 'USD'
        };
    }

    const normalizedCoupon = couponCode ? String(couponCode).trim().toUpperCase() : '';
    const coupon = normalizedCoupon ? COUPONS[normalizedCoupon] : null;

    const amountPaise = coupon ? coupon.amountPaise : product.price * 100;

    return {
        amountPaise,
        couponApplied: Boolean(coupon),
        productName: product.name,
        basePriceRupees: product.price,
        currency: 'INR'
    };
};
