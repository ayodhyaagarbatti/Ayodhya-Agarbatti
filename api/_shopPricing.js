import { products } from '../src/data/products.js';

export const FREE_SHIPPING_THRESHOLD = 400;
export const DELIVERY_CHARGE = 79;

// Server is the sole source of truth for cart totals - the browser only ever
// sends {id, selectedPackName, quantity} per line, never a price. This mirrors
// the pack lookup ProductDetails.jsx already does client-side for display.
//
// International orders are flat launch pricing (usdPrice fields on each product/pack,
// not a live INR/USD conversion) with shipping already folded in, so there's no
// separate international shipping fee the way there is for the India free-shipping
// threshold.
export const computeCartTotal = (cartItems, isIndia = true) => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        throw new Error('Cart is empty');
    }

    let subtotal = 0;
    // What was actually priced, line by line - used as the order's item list, so the
    // admin sees the exact pack and price charged rather than the browser's copy.
    const lines = [];
    for (const line of cartItems) {
        const product = products.find((p) => p.id === Number(line.id));
        if (!product) {
            throw new Error(`Unknown product: ${line.id}`);
        }
        const quantity = Math.max(1, Number(line.quantity) || 1);
        const pack = product.packOptions?.find((p) => p.size === line.selectedPackName);
        const unitPrice = isIndia
            ? (pack ? pack.price : product.numericPrice)
            : (pack ? pack.usdPrice : product.usdPrice);
        if (!Number.isFinite(unitPrice)) {
            throw new Error(`No price found for product: ${line.id}`);
        }
        subtotal += unitPrice * quantity;
        lines.push({
            id: product.id,
            name: product.name,
            variant: product.variant || '',
            // Unmatched pack names are charged the base price, so they're labelled as the base pack.
            pack: pack ? pack.size : (product.stickCount || ''),
            unitPrice,
            quantity,
            image: product.images?.[0] || product.image || ''
        });
    }

    const shippingFee = isIndia
        ? (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_CHARGE)
        : 0;
    const total = subtotal + shippingFee;

    return {
        subtotalPaise: subtotal * 100,
        shippingFeePaise: shippingFee * 100,
        totalPaise: total * 100,
        currency: isIndia ? 'INR' : 'USD',
        lines
    };
};
