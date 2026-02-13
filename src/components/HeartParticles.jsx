import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeartIcon = ({ size = 24, className = "" }) => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

const HeartParticles = ({ zIndex = 9999 }) => {
    const [hearts, setHearts] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const heart = {
                id: Math.random(),
                x: Math.random() * 100, // percentage
                y: 110, // start below bottom
                size: Math.random() * 20 + 10,
                duration: Math.random() * 5 + 5,
                delay: Math.random() * 2,
                opacity: Math.random() * 0.5 + 0.3,
                color: ['text-red-400', 'text-pink-400', 'text-red-500', 'text-pink-500'][Math.floor(Math.random() * 4)]
            };
            setHearts(prev => [...prev, heart]);

            // Cleanup
            setTimeout(() => {
                setHearts(prev => prev.filter(h => h.id !== heart.id));
            }, (heart.duration + heart.delay) * 1000);
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex }}>
            <AnimatePresence>
                {hearts.map(heart => (
                    <motion.div
                        key={heart.id}
                        initial={{ y: "110vh", x: `${heart.x}vw`, opacity: 0, scale: 0 }}
                        animate={{
                            y: "-10vh",
                            x: `${heart.x + (Math.random() * 10 - 5)}vw`,
                            opacity: heart.opacity,
                            scale: 1,
                            rotate: [0, 10, -10, 0]
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: heart.duration,
                            delay: heart.delay,
                            ease: "easeOut"
                        }}
                        className={`absolute ${heart.color}`}
                    >
                        <HeartIcon size={heart.size} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default HeartParticles;
