// Initialize GA4 gtag script dynamically if measurement ID is present
const GA_MEASUREMENT_ID = "G-K0D3Q6BJ2G";

export const initGoogleAnalytics = () => {
    if (typeof window === "undefined") return;
    if (window.gtag) return; // Already initialized

    // Inject Google Tag Manager script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
};

// GA4 Track Page View
export const trackPageView = (path, title) => {
    try {
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_path: path,
                page_title: title || document.title
            });
        }
    } catch (err) {
        console.warn("GA4 trackPageView note:", err);
    }
};

// GA4 Track Add to Cart
export const trackAddToCart = (product, quantity = 1) => {
    try {
        const itemData = {
            item_id: String(product.id),
            item_name: product.name,
            item_category: product.category || 'Incense',
            price: product.numericPrice || 70,
            quantity: quantity
        };

        if (window.gtag) {
            window.gtag('event', 'add_to_cart', {
                currency: 'INR',
                value: (product.numericPrice || 70) * quantity,
                items: [itemData]
            });
        }
    } catch (err) {
        console.warn("GA4 trackAddToCart note:", err);
    }
};

// Order items store price as a display string like "₹70" - GA4 needs a number.
const toNumber = (value) => (typeof value === 'number' ? value : Number(String(value || '').replace(/[^0-9.]/g, '')) || 0);

// GA4 Track Product View
export const trackViewItem = (product, currency = 'INR') => {
    try {
        if (window.gtag) {
            const price = currency === 'USD' ? product.usdPrice : product.numericPrice;
            window.gtag('event', 'view_item', {
                currency,
                value: price || 0,
                items: [{
                    item_id: String(product.id),
                    item_name: product.name,
                    item_category: product.category || 'Incense',
                    price: price || 0
                }]
            });
        }
    } catch (err) {
        console.warn("GA4 trackViewItem note:", err);
    }
};

// GA4 Track Begin Checkout
export const trackBeginCheckout = (cartItems, totalValue, currency = 'INR') => {
    try {
        const items = cartItems.map(item => ({
            item_id: String(item.id),
            item_name: item.name,
            price: item.numericPrice || toNumber(item.price),
            quantity: item.quantity
        }));

        if (window.gtag) {
            window.gtag('event', 'begin_checkout', {
                currency,
                value: totalValue,
                items: items
            });
        }
    } catch (err) {
        console.warn("GA4 trackBeginCheckout note:", err);
    }
};

// GA4 Track Purchase
export const trackPurchase = (order) => {
    try {
        if (window.gtag) {
            window.gtag('event', 'purchase', {
                transaction_id: order.orderNumber || order.id,
                value: toNumber(order.total),
                shipping: toNumber(order.shipping),
                currency: order.currency || 'INR',
                items: (order.items || []).map(item => ({
                    item_id: String(item.id),
                    item_name: item.name,
                    item_variant: item.variant || undefined,
                    price: toNumber(item.price),
                    quantity: item.quantity
                }))
            });
        }
    } catch (err) {
        console.warn("GA4 trackPurchase note:", err);
    }
};

// GA4 Track Search
export const trackSearch = (searchQuery) => {
    try {
        if (window.gtag) {
            window.gtag('event', 'search', { search_term: searchQuery });
        }
    } catch (err) {
        console.warn("GA4 trackSearch note:", err);
    }
};
