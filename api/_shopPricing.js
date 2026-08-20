import { products } from '../src/data/products.js';

export const FREE_SHIPPING_THRESHOLD = 500;
export const DELIVERY_CHARGE = 79;

// Server is the sole source of truth for cart totals - the browser only ever
// sends {id, selectedPackName, quantity} per line, never a price. This mirrors
// the pack lookup ProductDetails.jsx already does client-side for display.
export const computeCartTotal = (cartItems) => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        throw new Error('Cart is empty');
    }

    let subtotal = 0;
    for (const line of cartItems) {
        const product = products.find((p) => p.id === Number(line.id));
        if (!product) {
            throw new Error(`Unknown product: ${line.id}`);
        }
        const quantity = Math.max(1, Number(line.quantity) || 1);
        const pack = product.packOptions?.find((p) => p.size === line.selectedPackName);
        const unitPrice = pack ? pack.price : product.numericPrice;
        if (!Number.isFinite(unitPrice)) {
            throw new Error(`No price found for product: ${line.id}`);
        }
        subtotal += unitPrice * quantity;
    }

    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_CHARGE;
    const total = subtotal + shippingFee;

    return {
        subtotalPaise: subtotal * 100,
        shippingFeePaise: shippingFee * 100,
        totalPaise: total * 100
    };
};
