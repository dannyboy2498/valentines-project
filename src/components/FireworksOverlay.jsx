import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const Rocket = ({ x, targetY }) => {
    return (
        <motion.div
            initial={{ y: 200, x: '-50%' }}
            animate={{
                y: `${targetY}vh`, // Animate to the exact explosion point
                rotate: [0, -5, 5, 0],
                scale: [1, 1.1, 1]
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="fixed bottom-0 z-[1000]"
            style={{ left: `${x}vw` }}
        >
            <div className="relative flex flex-col items-center">
                {/* The Cone - Thinner (20px vs 30px) */}
                <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-bottom-[30px] border-b-[#f44336] relative z-10"
                    style={{ borderBottomWidth: '30px', borderBottomStyle: 'solid' }} />

                {/* The Body with Stripes - Thinner (8px vs 12px) */}
                <div
                    className="w-8 h-20 border-x-4 border-b-4 border-black border-t-0 relative z-10"
                    style={{
                        background: 'repeating-linear-gradient(-45deg, #ffd700, #ffd700 12px, #f44336 12px, #f44336 24px)'
                    }}
                >
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                </div>

                {/* The Fuse & Spark */}
                <div className="relative mt-[-4px]">
                    <div className="w-[2px] h-6 bg-black/80 mx-auto" />
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 180, 270] }}
                        transition={{ repeat: Infinity, duration: 0.1 }}
                        className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-5 h-5"
                    >
                        <div className="absolute inset-0 bg-yellow-400 blur-[3px] rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center text-yellow-200 text-[10px]">
                            ★
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

const FireworksOverlay = () => {
    const [rockets, setRockets] = useState([]);

    useEffect(() => {
        const playSound = (url, vol = 0.5) => {
            const audio = new Audio(url);
            audio.volume = vol;
            audio.play().catch(e => { });
        };

        const LAUNCH_SOUND = 'https://assets.mixkit.co/active_storage/sfx/616/616-preview.mp3';
        const TOY_POP_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2014/2014-preview.mp3';

        const duration = 18 * 1000;
        const animationEnd = Date.now() + duration;
        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        // Display with multiple overlapping rockets
        const rocketInterval = setInterval(() => {
            if (Date.now() > animationEnd) return clearInterval(rocketInterval);

            // Random chance to fire 1-2 rockets at once for a busier feel
            const count = Math.random() > 0.7 ? 2 : 1;

            for (let i = 0; i < count; i++) {
                const rocketId = Math.random();
                const launchX = randomInRange(5, 95);
                const explosionY = randomInRange(-85, -60); // Random height for diversity

                // Add a slight delay between staggered launches
                setTimeout(() => {
                    setRockets(prev => [...prev, { id: rocketId, x: launchX, targetY: explosionY }]);
                    playSound(LAUNCH_SOUND, 0.3);

                    // Explode exactly when it reaches targetY
                    setTimeout(() => {
                        setRockets(prev => prev.filter(r => r.id !== rocketId));
                        playSound(TOY_POP_SOUND, 0.6);

                        confetti({
                            particleCount: randomInRange(100, 140),
                            startVelocity: 35,
                            spread: 360,
                            origin: { x: launchX / 100, y: (100 + explosionY) / 100 },
                            colors: ['#ff0000', '#ffd700', '#ffffff', '#ff69b4', '#00ffff'],
                            gravity: 0.9,
                            scalar: 1.4
                        });
                    }, 1200); // Matches the new 1.2s flight duration
                }, i * 300);
            }
        }, 800); // Fired more frequently (800ms) for overlap

        return () => clearInterval(rocketInterval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[999]">
            {rockets.map(rocket => (
                <Rocket key={rocket.id} x={rocket.x} targetY={rocket.targetY} />
            ))}
        </div>
    );
};

export default FireworksOverlay;
