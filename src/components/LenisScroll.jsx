import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { setLenisInstance } from '../utils/lenisInstance';

const LenisScroll = ({ children }) => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });
        setLenisInstance(lenis);

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            setLenisInstance(null);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
};

export default LenisScroll;
