import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroAnimation = ({ onComplete }) => {
    // Stage 0: Initial Delay
    // Stage 1: Ram & Ravan Appear
    // Stage 2: Arrow Shoots
    // Stage 3: Impact (Ravan Burns)
    // Stage 4: Incense Reveal
    // Stage 5: Fade Out

    const [stage, setStage] = useState(0);

    useEffect(() => {
        const timeline = async () => {
            // Start
            await new Promise(r => setTimeout(r, 500));
            setStage(1); // Appear

            await new Promise(r => setTimeout(r, 2000));
            setStage(2); // Shoot

            await new Promise(r => setTimeout(r, 1200)); // Travel time
            setStage(3); // Impact

            await new Promise(r => setTimeout(r, 1500)); // Burning
            setStage(4); // Incense

            await new Promise(r => setTimeout(r, 3000)); // Show incense
            onComplete(); // End
        };

        timeline();
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black opacity-50"></div>

            {/* RAM (Left) */}
            <AnimatePresence>
                {stage >= 1 && stage < 5 && (
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute left-0 bottom-0 md:bottom-20 w-1/2 md:w-1/3 h-auto z-20 flex justify-start pl-4 md:pl-20"
                    >
                        <img
                            src="/white_ram_archer_silhouette.png" // We will need to remove background or use blending
                            alt="Lord Ram"
                            className="w-full max-w-[400px] h-auto object-contain brightness-0 invert drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* RAVAN (Right) */}
            <AnimatePresence>
                {stage >= 1 && stage < 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "brightness(3) hue-rotate(-45deg)" }} // Burn effect
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute right-0 bottom-0 md:bottom-20 w-1/2 md:w-1/3 h-auto z-20 flex justify-end pr-4 md:pr-20"
                    >
                        <img
                            src="/ravan_demon_silhouette.png"
                            alt="Ravan"
                            className="w-full max-w-[450px] h-auto object-contain brightness-0 invert opacity-80"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ARROW */}
            <AnimatePresence>
                {stage === 2 && (
                    <motion.div
                        initial={{ left: '15%', opacity: 1, scale: 0.5 }}
                        animate={{ left: '80%', opacity: 1, scale: 1 }} // Target Ravan
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "linear" }}
                        className="absolute bottom-[20%] md:bottom-[35%] z-30 h-8 w-24"
                    >
                        {/* CSS Golden Arrow using SVG */}
                        <svg viewBox="0 0 100 20" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,215,0,0.9)] filter brightness-150">
                            <defs>
                                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#8B4513" />
                                    <stop offset="50%" stopColor="#FFD700" />
                                    <stop offset="100%" stopColor="#FFF8DC" />
                                </linearGradient>
                            </defs>
                            <path d="M0,10 L80,10" stroke="url(#goldGradient)" strokeWidth="2" />
                            <path d="M80,10 L70,5 L70,15 L80,10 Z" fill="url(#goldGradient)" /> {/* Arrowhead */}
                            <path d="M0,10 L10,5 L0,10 L10,15 Z" fill="#8B4513" /> {/* Fletching */}
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* IMPACT EXPLOSION (Particle Substitute) */}
            <AnimatePresence>
                {stage === 3 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 1, 0], scale: 2 }}
                        transition={{ duration: 1 }}
                        className="absolute right-[10%] bottom-[20%] w-64 h-64 bg-orange-500 rounded-full blur-[80px]"
                    />
                )}
            </AnimatePresence>

            {/* INCENSE REVEAL */}
            <AnimatePresence>
                {stage >= 4 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute z-40 flex flex-col items-center justify-center"
                    >
                        <img
                            src="/incense_stick_reveal.png"
                            alt="Agarbatti"
                            className="h-[300px] md:h-[500px] object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                        />
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="font-serif text-3xl md:text-5xl text-gold mt-8 tracking-widest uppercase text-center"
                        >
                            Victory of Light
                        </motion.h1>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default IntroAnimation;
