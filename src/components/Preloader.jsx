import React from 'react';
import { motion } from 'framer-motion';

const Preloader = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-ivory flex items-center justify-center pointer-events-none"
        >
            <div className="relative">
                <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    src="/images/ayodhya_logo.png"
                    alt="Loading..."
                    className="w-32 md:w-48 mix-blend-multiply brightness-110 contrast-125"
                />
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                    className="h-0.5 bg-gold mt-8 mx-auto"
                ></motion.div>
            </div>
        </motion.div>
    );
};

export default Preloader;
