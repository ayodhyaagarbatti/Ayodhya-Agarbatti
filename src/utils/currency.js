// International prices are flat launch pricing (not a live INR/USD conversion), set
// per src/data/products.js and src/data/horoscopeProducts.js `usdPrice` fields.
export const formatProductPrice = (product, isIndia) => {
    if (isIndia) return product.price;
    return `$${product.usdPrice}`;
};

export const formatPackOptionPrice = (option, isIndia) => {
    if (isIndia) return `₹${option.price}`;
    return `$${option.usdPrice}`;
};

export const formatHoroscopePrice = (product, isIndia) => {
    if (isIndia) return `₹${product.price}`;
    return `$${product.usdPrice}`;
};
