import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SOUND_ASSETS } from '../config/assets';

const Rocket = ({ x, targetY }) => {
    return (
        <motion.div
            initial={{ y: 200, x: '-50%' }}
            animate={{
                y: `${targetY}vh`,
                rotate: [0, -1, 1, 0],
            }}
            transition={{ duration: 1.0, ease: "linear" }}
            className="fixed bottom-0 z-[1000]"
            style={{ left: `${x}vw` }}
        >
            <div className="relative flex flex-col items-center">
                {/* Ultra-Thin Rocket Body */}
                <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-bottom-[18px] border-b-[#f44336] relative z-10"
                    style={{ borderBottomWidth: '18px', borderBottomStyle: 'solid' }} />

                <div
                    className="w-2.5 h-14 border-x-[2px] border-b-[2px] border-black border-t-0 relative z-10"
                    style={{
                        background: 'repeating-linear-gradient(-45deg, #ffd700, #ffd700 5px, #f44336 5px, #f44336 10px)'
                    }}
                >
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                </div>

                {/* Fuse */}
                <div className="relative mt-[-2px]">
                    <div className="w-[0.8px] h-4 bg-black/80 mx-auto" />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.1 }}
                        className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 blur-[1px] rounded-full"
                    />
                </div>
            </div>
        </motion.div>
    );
};

const FireworksOverlay = () => {
    const [rockets, setRockets] = useState([]);

    useEffect(() => {
        const playSound = (url, vol = 0.5) => {
            if (!url) return;
            const audio = new Audio(url);
            audio.volume = vol;
            audio.play().catch(e => { });
        };

        const duration = 18 * 1000;
        const animationEnd = Date.now() + duration;
        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const rocketInterval = setInterval(() => {
            if (Date.now() > animationEnd) return clearInterval(rocketInterval);

            const count = Math.random() > 0.6 ? 2 : 1;

            for (let i = 0; i < count; i++) {
                const rocketId = Math.random();
                const launchX = randomInRange(15, 85);
                const explosionY = randomInRange(-75, -45);

                setTimeout(() => {
                    setRockets(prev => [...prev, { id: rocketId, x: launchX, targetY: explosionY }]);
                    playSound(SOUND_ASSETS.firework_launch, 0.25);

                    setTimeout(() => {
                        setRockets(prev => prev.filter(r => r.id !== rocketId));
                        playSound(SOUND_ASSETS.firework_explosion, 0.4);

                        confetti({
                            particleCount: randomInRange(80, 110),
                            startVelocity: 30,
                            spread: 360,
                            origin: { x: launchX / 100, y: (100 + explosionY) / 100 },
                            colors: ['#ff0000', '#ffd700', '#ffffff', '#ff69b4', '#00ffff'],
                            gravity: 1.1,
                            scalar: 1.1
                        });
                    }, 1000);
                }, i * 450);
            }
        }, 1000);

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
