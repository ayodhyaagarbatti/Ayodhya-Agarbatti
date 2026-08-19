import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";

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
        if (analytics) {
            logEvent(analytics, 'page_view', { page_path: path });
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
            price: product.numericPrice || 299,
            quantity: quantity
        };

        if (window.gtag) {
            window.gtag('event', 'add_to_cart', {
                currency: 'INR',
                value: (product.numericPrice || 299) * quantity,
                items: [itemData]
            });
        }
        if (analytics) {
            logEvent(analytics, 'add_to_cart', { items: [itemData] });
        }
    } catch (err) {
        console.warn("GA4 trackAddToCart note:", err);
    }
};

// GA4 Track Begin Checkout
export const trackBeginCheckout = (cartItems, totalValue) => {
    try {
        const items = cartItems.map(item => ({
            item_id: String(item.id),
            item_name: item.name,
            price: item.numericPrice || 299,
            quantity: item.quantity
        }));

        if (window.gtag) {
            window.gtag('event', 'begin_checkout', {
                currency: 'INR',
                value: totalValue,
                items: items
            });
        }
        if (analytics) {
            logEvent(analytics, 'begin_checkout', { value: totalValue, items });
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
                value: order.total,
                currency: 'INR',
                items: (order.items || []).map(item => ({
                    item_id: String(item.id),
                    item_name: item.name,
                    price: item.price,
                    quantity: item.quantity
                }))
            });
        }
        if (analytics) {
            logEvent(analytics, 'purchase', {
                transaction_id: order.orderNumber || order.id,
                value: order.total,
                currency: 'INR'
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
        if (analytics) {
            logEvent(analytics, 'search', { search_term: searchQuery });
        }
    } catch (err) {
        console.warn("GA4 trackSearch note:", err);
    }
};
