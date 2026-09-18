import React, { useState, useEffect } from 'react';
import {
    Package, CheckCircle, Download, KeyRound, Lock, Trash2,
    Search, Mail, Users, Star, IndianRupee, Eye, AlertCircle, RefreshCw,
    Clock, Check, Filter, ExternalLink, PlusCircle, Activity, ShoppingCart,
    Compass, Monitor, Smartphone, Globe, Wallet, X as XIcon
} from 'lucide-react';
// Firestore rules deny all direct client reads/writes of admin data (orders, contact
// messages, subscribers, reviews, activity logs, redemption requests all contain
// customer PII, and the admin password gate below is invisible to Firestore rules -
// they can't tell an authenticated admin apart from any other signed-in visitor). So
// this page never touches the Firestore client SDK: everything goes through
// /api/admin-list and /api/admin-mutate, gated server-side by the same admin session
// token, using the Admin SDK which bypasses Firestore rules entirely.
const POLL_INTERVAL_MS = 20000;

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'activity' | 'messages' | 'subscribers' | 'reviews' | 'redemptions'
    const [dataLoadError, setDataLoadError] = useState('');

    // Server-backed admin data (fetched via /api/admin-list, never the client Firestore SDK)
    const [orders, setOrders] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [messages, setMessages] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [redemptions, setRedemptions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [activityFilter, setActivityFilter] = useState('ALL');
    const [redemptionFilter, setRedemptionFilter] = useState('pending');

    // Tracks in-flight write/delete actions (keyed e.g. "order-delete-123") so their
    // triggering buttons can be disabled and rapid double-clicks can't fire duplicate writes.
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [pendingActions, setPendingActions] = useState(new Set());

    const beginPending = (key) => setPendingActions(prev => new Set(prev).add(key));
    const endPending = (key) => setPendingActions(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
    });

    // Fetches one collection from the server-side admin API. Returns the items so
    // callers awaiting a Promise.all get the data directly, in addition to the setter
    // updating state for the normal render path.
    const fetchCollection = async (name, setter) => {
        const token = sessionStorage.getItem('adminAuth');
        if (!token) return [];
        try {
            const res = await fetch('/api/admin-list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, collection: name })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || `Failed to load ${name}`);
            setter(data.items);
            return data.items;
        } catch (err) {
            setDataLoadError(err.message || `Failed to load ${name}.`);
            return [];
        }
    };

    const fetchAllData = async () => {
        await Promise.all([
            fetchCollection('orders', setOrders),
            fetchCollection('activity_logs', setActivityLogs),
            fetchCollection('contact_messages', setMessages),
            fetchCollection('subscribers', setSubscribers),
            fetchCollection('reviews', setReviews),
            fetchCollection('redemption_requests', setRedemptions)
        ]);
        setLoading(false);
    };

    useEffect(() => {
        // Verify any existing session token server-side (signature + expiry) -
        // a stale/forged sessionStorage value alone is no longer enough.
        const token = sessionStorage.getItem('adminAuth');
        if (!token) {
            setCheckingSession(false);
            return;
        }
        fetch('/api/admin-verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        })
            .then((r) => r.json())
            .then((data) => {
                if (data.valid) {
                    setIsAuthenticated(true);
                } else {
                    sessionStorage.removeItem('adminAuth');
                }
            })
            .catch(() => sessionStorage.removeItem('adminAuth'))
            .finally(() => setCheckingSession(false));
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchAllData();
        // Not true real-time (that would need the client Firestore SDK, which rules now
        // deny for these collections) - poll instead so the dashboard still feels live.
        const interval = setInterval(fetchAllData, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);
        try {
            const res = await fetch('/api/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (!res.ok || !data.token) {
                setError(data.error || 'Invalid credentials. Access denied.');
                return;
            }
            sessionStorage.setItem('adminAuth', data.token);
            setIsAuthenticated(true);
        } catch (err) {
            setError('Could not reach the server. Please try again.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('adminAuth');
    };

    // Every mutation below calls /api/admin-mutate with the admin session token -
    // never the client Firestore SDK - then refetches so the UI reflects the change.
    const adminMutate = async (action, extra = {}) => {
        const token = sessionStorage.getItem('adminAuth');
        const res = await fetch('/api/admin-mutate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, action, ...extra })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Action failed.');
        return data;
    };

    // --- Create Test Order in Database ---
    const handleCreateTestOrder = async () => {
        if (isCreatingOrder) return;
        setIsCreatingOrder(true);
        try {
            const data = await adminMutate('create-test-order');
            alert(`Success! Test order written to Firestore Database with Document ID: ${data.id}`);
            await fetchCollection('orders', setOrders);
        } catch (err) {
            console.error("Error creating test order in database:", err);
            alert("Failed to write to database: " + err.message);
        } finally {
            setIsCreatingOrder(false);
        }
    };

    // --- Order Database Operations ---
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await adminMutate('update-order-status', { orderId, status: newStatus });
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error("Failed to update order status in database:", err);
            alert("Error updating database: " + err.message);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order from database?")) return;
        const key = `order-delete-${orderId}`;
        if (pendingActions.has(key)) return;
        beginPending(key);
        try {
            await adminMutate('delete-order', { orderId });
            setOrders(prev => prev.filter(o => o.id !== orderId));
        } catch (err) {
            console.error("Failed to delete order from database:", err);
            alert("Error deleting order: " + err.message);
        } finally {
            endPending(key);
        }
    };

    // --- Activity Log Deletion ---
    const handleDeleteLog = async (logId) => {
        const key = `log-delete-${logId}`;
        if (pendingActions.has(key)) return;
        beginPending(key);
        try {
            await adminMutate('delete-log', { logId });
            setActivityLogs(prev => prev.filter(l => l.id !== logId));
        } catch (err) {
            console.error("Error deleting log:", err);
        } finally {
            endPending(key);
        }
    };

    // --- Message Database Operations ---
    const handleToggleMessageRead = async (messageId, currentStatus) => {
        const key = `message-toggle-${messageId}`;
        if (pendingActions.has(key)) return;
        beginPending(key);
        try {
            const nextStatus = currentStatus === 'read' ? 'unread' : 'read';
            await adminMutate('toggle-message-read', { messageId });
            setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: nextStatus } : m));
        } catch (err) {
            console.error("Error updating message status:", err);
        } finally {
            endPending(key);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (!window.confirm("Delete this message from database?")) return;
        const key = `message-delete-${messageId}`;
        if (pendingActions.has(key)) return;
        beginPending(key);
        try {
            await adminMutate('delete-message', { messageId });
            setMessages(prev => prev.filter(m => m.id !== messageId));
        } catch (err) {
            console.error("Error deleting message:", err);
        } finally {
            endPending(key);
        }
    };

    // --- Subscriber Database Operations ---
    const handleDeleteSubscriber = async (subId) => {
        if (!window.confirm("Remove subscriber from database?")) return;
        const key = `subscriber-delete-${subId}`;
        if (pendingActions.has(key)) return;
        beginPending(key);
        try {
            await adminMutate('delete-subscriber', { subId });
            setSubscribers(prev => prev.filter(s => s.id !== subId));
        } catch (err) {
            console.error("Error deleting subscriber:", err);
        } finally {
            endPending(key);
        }
    };

    // --- Review Database Operations ---
    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Delete review from database?")) return;
        const key = `review-delete-${reviewId}`;
        if (pendingActions.has(key)) return;
        beginPending(key);
        try {
            await adminMutate('delete-review', { reviewId });
            setReviews(prev => prev.filter(r => r.id !== reviewId));
        } catch (err) {
            console.error("Error deleting review:", err);
        } finally {
            endPending(key);
        }
    };

    // --- Wallet Redemption Operations (money-mutating, so this goes through the
    // server endpoint with the admin session token, never a direct Firestore write) ---
    const handleResolveRedemption = async (requestId, action) => {
        const verb = action === 'paid' ? 'mark this redemption as paid' : 'reject this redemption';
        if (!window.confirm(`Are you sure you want to ${verb}? This cannot be undone.`)) return;
        const key = `redemption-resolve-${requestId}`;
        if (pendingActions.has(key)) return;
        beginPending(key);
        try {
            const token = sessionStorage.getItem('adminAuth');
            const res = await fetch('/api/admin-resolve-redemption', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, requestId, action })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to resolve redemption request');
            await fetchCollection('redemption_requests', setRedemptions);
        } catch (err) {
            console.error("Error resolving redemption request:", err);
            alert("Error: " + err.message);
        } finally {
            endPending(key);
        }
    };

    // --- Export CSV ---
    const downloadCSV = () => {
        if (orders.length === 0) {
            alert("No orders in database to export.");
            return;
        }

        const headers = ["Order Ref", "Doc ID", "Date", "Customer Name", "Phone", "Email", "Address", "Items", "Payment Method", "Payment Status", "Total (INR)", "Order Status"];
        const rows = orders.map(order => [
            order.orderNumber || order.id,
            order.id,
            order.date ? order.date.replace(/,/g, '') : '',
            order.customer?.name || '',
            order.customer?.phone || '',
            order.customer?.email || '',
            `"${order.customer?.address || ''}"`,
            `"${(order.items || []).map(i => `${i.name} (x${i.quantity})`).join(', ')}"`,
            order.customer?.paymentMethod || 'Online',
            order.paymentStatus || 'Paid',
            order.total || 0,
            order.status || 'Order Placed'
        ]);

        const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `ayodhya_database_orders_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filtered orders calculation
    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
            !searchQuery ||
            (order.orderNumber && order.orderNumber.toLowerCase().includes(query)) ||
            (order.id && order.id.toLowerCase().includes(query)) ||
            (order.customer?.name && order.customer.name.toLowerCase().includes(query)) ||
            (order.customer?.email && order.customer.email.toLowerCase().includes(query)) ||
            (order.customer?.phone && order.customer.phone.toLowerCase().includes(query));
        return matchesStatus && matchesQuery;
    });

    const filteredLogs = activityLogs.filter(log => {
        if (activityFilter === 'ALL') return true;
        return log.type === activityFilter;
    });

    const filteredRedemptions = redemptions.filter(r => redemptionFilter === 'ALL' || r.status === redemptionFilter);

    const totalRevenue = orders.reduce((acc, o) => acc + (parseInt(o.total) || 0), 0);
    const unreadMessagesCount = messages.filter(m => m.status === 'unread').length;
    const pageViewCount = activityLogs.filter(l => l.type === 'PAGE_VIEW').length;
    const cartActionCount = activityLogs.filter(l => l.type === 'CART_ACTION').length;
    const pendingRedemptionCount = redemptions.filter(r => r.status === 'pending').length;

    if (checkingSession) {
        return <div className="min-h-screen bg-ivory flex items-center justify-center pt-32" />;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center p-6 pt-32">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock size={24} className="text-gold" />
                    </div>

                    <h2 className="font-heading text-2xl text-charcoal mb-2">Ayodhya Agarbatti Database</h2>
                    <p className="text-gray-500 text-sm mb-8">Enter access key to view & manage database records.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm"
                                placeholder="Enter Access Key"
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

                        <button type="submit" disabled={isLoggingIn} className="w-full bg-charcoal text-white py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-gold hover:text-charcoal transition-all disabled:opacity-50">
                            {isLoggingIn ? 'Checking...' : 'Access Admin Database'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-heading text-2xl md:text-3xl text-charcoal">Database Control Center</h1>
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Secure Server Sync
                            </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">Auto-refreshes every 20s across orders, activity, contacts, subscribers, reviews & redemptions.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleCreateTestOrder}
                            disabled={isCreatingOrder}
                            className="bg-gold text-charcoal px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-charcoal hover:text-gold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PlusCircle size={15} /> {isCreatingOrder ? 'Creating...' : 'Create Sample Order in Database'}
                        </button>
                        <button
                            onClick={downloadCSV}
                            className="bg-charcoal text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gold hover:text-charcoal transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Download size={15} /> Export Orders CSV
                        </button>
                        <button
                            onClick={() => { setLoading(true); fetchAllData(); }}
                            disabled={loading}
                            className="bg-white border border-gray-300 text-charcoal px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                        >
                            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-white border border-gray-300 text-red-600 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-50 transition-colors shadow-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Data Load Error Alert */}
                {dataLoadError && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                        <div className="text-xs text-amber-900 space-y-1">
                            <p className="font-bold">Couldn't load admin data:</p>
                            <p>{dataLoadError}</p>
                            <p className="font-medium mt-1">
                                Check that FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY are set in Vercel's environment variables, or try logging out and back in if your session expired.
                            </p>
                        </div>
                    </div>
                )}

                {/* Dashboard Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-gold/10 text-gold rounded-lg flex items-center justify-center font-bold">
                            <Package size={22} />
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 font-bold uppercase">Total Orders</span>
                            <h3 className="text-2xl font-bold text-charcoal">{orders.length}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-bold">
                            <IndianRupee size={22} />
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 font-bold uppercase">Total Revenue</span>
                            <h3 className="text-2xl font-bold text-charcoal">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center font-bold">
                            <Activity size={22} />
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 font-bold uppercase">Live Activity</span>
                            <h3 className="text-2xl font-bold text-charcoal">{activityLogs.length}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold relative">
                            <Mail size={22} />
                            {unreadMessagesCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                                    {unreadMessagesCount}
                                </span>
                            )}
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 font-bold uppercase">Inquiries</span>
                            <h3 className="text-2xl font-bold text-charcoal">{messages.length}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 col-span-2 md:col-span-1">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center font-bold">
                            <Users size={22} />
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 font-bold uppercase">Subscribers</span>
                            <h3 className="text-2xl font-bold text-charcoal">{subscribers.length}</h3>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 gap-2 bg-white p-2 rounded-xl shadow-sm overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'orders' ? 'bg-charcoal text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Package size={16} /> Orders ({orders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'activity' ? 'bg-charcoal text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Activity size={16} className="text-amber-400 animate-pulse" /> Live Activity Stream ({activityLogs.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative whitespace-nowrap ${activeTab === 'messages' ? 'bg-charcoal text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Mail size={16} /> Messages ({messages.length})
                        {unreadMessagesCount > 0 && (
                            <span className="bg-gold text-charcoal font-bold text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                                {unreadMessagesCount} new
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('subscribers')}
                        className={`flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'subscribers' ? 'bg-charcoal text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Users size={16} /> Subscribers ({subscribers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'reviews' ? 'bg-charcoal text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Star size={16} /> Reviews ({reviews.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('redemptions')}
                        className={`flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative whitespace-nowrap ${activeTab === 'redemptions' ? 'bg-charcoal text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Wallet size={16} /> Redemptions ({redemptions.length})
                        {pendingRedemptionCount > 0 && (
                            <span className="bg-gold text-charcoal font-bold text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                                {pendingRedemptionCount} pending
                            </span>
                        )}
                    </button>
                </div>

                {/* TAB 1: ORDERS */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        
                        {/* Search & Filter Bar */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by customer, phone, order #..."
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-gold"
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <Filter size={14} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-500 uppercase">Status:</span>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-charcoal focus:outline-none"
                                >
                                    <option value="ALL">All Statuses</option>
                                    <option value="Order Placed">Order Placed</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center text-gray-400">Loading orders from database...</div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">No matching orders found in database.</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <div key={order.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                                            
                                            {/* Column 1: Order Details */}
                                            <div className="min-w-[200px]">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono font-bold text-gold">
                                                        {order.orderNumber || `AYD-${order.id.slice(0, 6)}`}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                                                    <Clock size={12} /> {order.date || 'Just now'}
                                                </p>

                                                <div className="mt-3">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                                        Database Status:
                                                    </label>
                                                    <select
                                                        value={order.status || 'Order Placed'}
                                                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                        className="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-xs font-bold text-charcoal focus:outline-none focus:border-gold cursor-pointer"
                                                    >
                                                        <option value="Order Placed">📦 Order Placed</option>
                                                        <option value="Processing">⚙️ Processing</option>
                                                        <option value="Shipped">🚚 Shipped</option>
                                                        <option value="Delivered">✅ Delivered</option>
                                                        <option value="Cancelled">❌ Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Column 2: Customer */}
                                            <div className="min-w-[220px]">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Details</span>
                                                <h4 className="font-bold text-charcoal mt-1 text-sm">{order.customer?.name || 'Guest'}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">{order.customer?.email}</p>
                                                <p className="text-xs text-gray-500">{order.customer?.phone}</p>
                                                <p className="text-xs text-gray-400 mt-2 max-w-xs bg-gray-50 p-2 rounded border border-gray-100">
                                                    📍 {order.customer?.address}
                                                </p>
                                            </div>

                                            {/* Column 3: Items */}
                                            <div className="flex-1">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Items Ordered</span>
                                                <div className="mt-2 space-y-1.5">
                                                    {(order.items || []).map((item, idx) => (
                                                        <div key={idx} className="flex justify-between text-xs items-center bg-gray-50/60 p-2 rounded">
                                                            <span className="text-gray-800 font-medium">{item.name} <span className="text-gold font-bold">x{item.quantity}</span></span>
                                                            <span className="font-bold text-charcoal">{item.price}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                                                    <span className="text-gray-500">
                                                        Payment: <span className="font-bold text-charcoal">{order.customer?.paymentMethod || 'Online'}</span> ({order.paymentStatus || 'Paid'})
                                                    </span>
                                                    <div className="text-right">
                                                        <span className="text-xs text-gray-400 block">Total Amount</span>
                                                        <span className="font-bold text-gold text-base">₹{order.total}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Column 4: Delete */}
                                            <div className="flex items-center lg:self-center">
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    disabled={pendingActions.has(`order-delete-${order.id}`)}
                                                    className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Delete order from database"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: LIVE ACTIVITY STREAM (FINE-GRAINED MINUTE DETAILS) */}
                {activeTab === 'activity' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        
                        {/* Activity Filter Bar */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Activity className="text-amber-500" size={16} />
                                <span className="text-xs font-bold text-charcoal uppercase">Live Event Stream</span>
                                <span className="text-[11px] text-gray-400">({filteredLogs.length} events recorded)</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter size={14} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-500 uppercase">Event Type:</span>
                                <select
                                    value={activityFilter}
                                    onChange={(e) => setActivityFilter(e.target.value)}
                                    className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-charcoal focus:outline-none"
                                >
                                    <option value="ALL">All Events</option>
                                    <option value="PAGE_VIEW">👁️ Page Views ({pageViewCount})</option>
                                    <option value="CART_ACTION">🛒 Cart Edits ({cartActionCount})</option>
                                    <option value="CHECKOUT_STEP">💳 Checkout Steps</option>
                                    <option value="SEARCH">🔍 Search Queries</option>
                                </select>
                            </div>
                        </div>

                        {filteredLogs.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                No activity events recorded in database yet. Navigate the site or add items to cart to generate live events!
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 max-h-[650px] overflow-y-auto">
                                {filteredLogs.map((log, idx) => (
                                    <div key={log.id || idx} className="p-4 hover:bg-gray-50/70 transition-colors text-xs flex justify-between items-start gap-4">
                                        <div className="flex items-start gap-3">
                                            {/* Icon Badge */}
                                            <div className="mt-0.5">
                                                {log.type === 'PAGE_VIEW' && (
                                                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                                        <Globe size={16} />
                                                    </span>
                                                )}
                                                {log.type === 'CART_ACTION' && (
                                                    <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                                                        <ShoppingCart size={16} />
                                                    </span>
                                                )}
                                                {log.type === 'CHECKOUT_STEP' && (
                                                    <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                                                        <Compass size={16} />
                                                    </span>
                                                )}
                                                {log.type === 'SEARCH' && (
                                                    <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                                        <Search size={16} />
                                                    </span>
                                                )}
                                            </div>

                                            {/* Details Content */}
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-charcoal uppercase tracking-wider text-[11px]">
                                                        {log.type.replace('_', ' ')}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                                        {log.sessionId}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                        <Monitor size={11} /> {log.device} • {log.browser} ({log.screenSize})
                                                    </span>
                                                </div>

                                                {/* Event Specific Sub-Details */}
                                                {log.type === 'PAGE_VIEW' && (
                                                    <p className="text-gray-700">
                                                        Visited page <span className="font-mono font-bold text-blue-700">{log.details?.path}</span> ({log.details?.title})
                                                    </p>
                                                )}

                                                {log.type === 'CART_ACTION' && (
                                                    <p className="text-gray-700">
                                                        <span className="font-bold text-amber-700">{log.details?.action}</span>: {log.details?.itemName} ({log.details?.itemPrice}) — Cart Total: <span className="font-bold text-charcoal">₹{log.details?.cartTotal}</span> ({log.details?.totalItemsInCart} items)
                                                    </p>
                                                )}

                                                {log.type === 'CHECKOUT_STEP' && (
                                                    <p className="text-gray-700">
                                                        Checkout Step <span className="font-bold text-purple-700">#{log.details?.stepNumber} ({log.details?.stepName})</span> — Total: ₹{log.details?.total}
                                                    </p>
                                                )}

                                                {log.type === 'SEARCH' && (
                                                    <p className="text-gray-700">
                                                        Searched for <span className="font-bold text-emerald-700">"{log.details?.query}"</span> ({log.details?.resultCount} results)
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Timestamp & Action */}
                                        <div className="flex items-center gap-3 shrink-0 text-[11px] text-gray-400">
                                            <span>{log.timestamp || 'Just now'}</span>
                                            {log.id && (
                                                <button
                                                    onClick={() => handleDeleteLog(log.id)}
                                                    disabled={pendingActions.has(`log-delete-${log.id}`)}
                                                    className="text-gray-300 hover:text-red-600 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Delete log"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: CONTACT MESSAGES */}
                {activeTab === 'messages' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {messages.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">No contact messages saved in database yet.</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`p-6 transition-colors ${msg.status === 'unread' ? 'bg-blue-50/30' : 'bg-white'}`}>
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-bold text-charcoal text-base">{msg.name}</h3>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${msg.status === 'unread' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                                        {msg.status === 'unread' ? 'New Message' : 'Read'}
                                                    </span>
                                                    <span className="text-xs text-gold font-semibold uppercase">{msg.subject}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{msg.email} • {msg.date || 'Recent'}</p>
                                                <p className="text-sm text-gray-700 mt-3 p-4 bg-gray-50 rounded-lg border border-gray-100 leading-relaxed">
                                                    "{msg.message}"
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleToggleMessageRead(msg.id, msg.status)}
                                                    disabled={pendingActions.has(`message-toggle-${msg.id}`)}
                                                    className="px-3 py-1.5 rounded-lg border text-xs font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {msg.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                    disabled={pendingActions.has(`message-delete-${msg.id}`)}
                                                    className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Delete message from database"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 4: SUBSCRIBERS */}
                {activeTab === 'subscribers' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
                        {subscribers.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">No newsletter subscribers in database yet.</div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                    <h3 className="font-heading text-lg text-charcoal">Subscribed Emails</h3>
                                    <span className="text-xs font-bold text-gold uppercase">{subscribers.length} total subscribers</span>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {subscribers.map((sub) => (
                                        <div key={sub.id} className="py-3 flex justify-between items-center text-sm">
                                            <div>
                                                <span className="font-bold text-charcoal">{sub.email}</span>
                                                <span className="text-xs text-gray-400 ml-4">Subscribed: {sub.subscribedAt || 'Recent'}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteSubscriber(sub.id)}
                                                disabled={pendingActions.has(`subscriber-delete-${sub.id}`)}
                                                className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Remove subscriber from database"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 5: REVIEWS */}
                {activeTab === 'reviews' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {reviews.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">No user reviews saved in database yet.</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {reviews.map((rev) => (
                                    <div key={rev.id} className="p-6 flex justify-between items-start gap-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-bold text-charcoal">{rev.name}</h4>
                                                <div className="flex text-gold">
                                                    {[...Array(rev.rating || 5)].map((_, i) => (
                                                        <Star key={i} size={14} fill="currentColor" />
                                                    ))}
                                                </div>
                                                <span className="text-xs font-bold text-gray-400">Product: {rev.productName || rev.productSlug || 'Incense'}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{rev.date || 'Verified Buyer'}</p>
                                            <p className="text-sm text-gray-700 mt-2 font-body italic bg-gray-50 p-3 rounded border border-gray-100">
                                                "{rev.comment}"
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteReview(rev.id)}
                                            disabled={pendingActions.has(`review-delete-${rev.id}`)}
                                            className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Delete review from database"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 6: WALLET REDEMPTIONS */}
                {activeTab === 'redemptions' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
                            <Filter size={14} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-500 uppercase">Status:</span>
                            <select
                                value={redemptionFilter}
                                onChange={(e) => setRedemptionFilter(e.target.value)}
                                className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-charcoal focus:outline-none"
                            >
                                <option value="ALL">All</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        {filteredRedemptions.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">No {redemptionFilter !== 'ALL' ? redemptionFilter : ''} redemption requests.</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredRedemptions.map((r) => (
                                    <div key={r.id} className="p-6 flex flex-col lg:flex-row justify-between items-start gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-charcoal">₹{(r.netPayoutPaise / 100).toFixed(2)} net payout</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                                    r.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    r.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {r.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Requested ₹{(r.requestedAmountPaise / 100).toFixed(2)}{r.feePaise > 0 ? ` · ₹${(r.feePaise / 100).toFixed(2)} fee` : ' · no fee'} · uid {r.uid}
                                            </p>
                                            <div className="text-xs text-gray-600 mt-2 bg-gray-50 p-3 rounded border border-gray-100 font-mono">
                                                {r.payoutMethod === 'upi'
                                                    ? `UPI: ${r.payoutDetails?.upiId}`
                                                    : `Bank: ${r.payoutDetails?.accountHolderName} · ${r.payoutDetails?.accountNumber} · ${r.payoutDetails?.ifsc}`}
                                            </div>
                                        </div>

                                        {r.status === 'pending' && (
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleResolveRedemption(r.id, 'paid')}
                                                    disabled={pendingActions.has(`redemption-resolve-${r.id}`)}
                                                    className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-green-700 transition-colors disabled:opacity-50"
                                                >
                                                    <CheckCircle size={14} /> Mark Paid
                                                </button>
                                                <button
                                                    onClick={() => handleResolveRedemption(r.id, 'rejected')}
                                                    disabled={pendingActions.has(`redemption-resolve-${r.id}`)}
                                                    className="flex items-center gap-1.5 border border-gray-300 text-red-600 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-50 transition-colors disabled:opacity-50"
                                                >
                                                    <XIcon size={14} /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Admin;
