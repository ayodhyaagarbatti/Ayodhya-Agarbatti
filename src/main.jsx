import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.jsx';
import './index.css';
import './i18n';
import { initGoogleAnalytics } from './utils/googleAnalytics';

// Initialize Google Analytics (GA4)
initGoogleAnalytics();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
        <Analytics />
        <SpeedInsights />
    </React.StrictMode>,
);
