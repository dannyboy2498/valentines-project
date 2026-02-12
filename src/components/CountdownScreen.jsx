import React from 'react';
import { Clock, Calendar, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DASHBOARD_CONTENT } from '../config/content';

const CountdownScreen = ({ timeRemaining }) => {
    const seconds = Math.floor((timeRemaining / 1000) % 60);
    const minutes = Math.floor((timeRemaining / (1000 * 60) % 60));
    const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

    const TimeUnit = ({ label, value }) => (
        <div className="flex flex-col items-center justify-center p-3 md:p-4 border-[6px] border-black bg-white shadow-[6px_6px_0px_0px_#000] min-w-[70px] md:min-w-[110px]">
            <span className="text-3xl md:text-5xl font-black italic tracking-tighter leading-none text-black">
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-[10px] md:text-xs font-black uppercase mt-1 md:mt-2 tracking-widest text-black/60">
                {label}
            </span>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen px-4 bg-transparent relative select-none text-black overflow-visible">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white border-[8px] border-black p-6 md:p-10 shadow-[25px_25px_0px_0px_#000] max-w-2xl w-full text-center flex flex-col items-center relative"
            >
                {/* Decorative Badge */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white font-black py-2 px-8 border-[6px] border-black shadow-[8px_8px_0px_0px_#000] transform -rotate-2 z-10">
                    <span className="text-xl italic uppercase">Wait for it...</span>
                </div>

                {/* 1. TOP: LARGE CLOCK */}
                <div className="mt-4 mb-10 relative">
                    <div className="bg-pink-100 border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#000] relative z-20">
                        <Clock size={80} className="text-black animate-pulse" strokeWidth={2.5} />
                    </div>
                    <div className="absolute inset-0 bg-yellow-400 translate-x-2 translate-y-2 z-10 border-4 border-black" />
                </div>

                {/* 2. TITLE AREA (DROPPED FOR BETTER BALANCE) */}
                <h1 className="text-xl md:text-[28px] font-black mb-4 uppercase tracking-tight w-full whitespace-nowrap text-black">
                    Something Special Is Coming...
                </h1>

                {/* SEPARATOR LINE ABOVE TIMER */}
                <div className="w-full h-2 bg-black mb-8" />

                {/* 3. CENTERED COUNTDOWN */}
                <div className="grid grid-cols-4 gap-2 md:gap-6 w-full mb-8 px-2">
                    <TimeUnit label="Days" value={days} />
                    <TimeUnit label="Hours" value={hours} />
                    <TimeUnit label="Mins" value={minutes} />
                    <TimeUnit label="Secs" value={seconds} />
                </div>

                {/* SEPARATOR LINE BELOW TIMER */}
                <div className="w-full h-2 bg-black mb-6" />

                {/* 4. DATE AREA (MOVED DOWN - PRESERVING GREY & HEARTS) */}
                <div className="relative mt-2 w-full flex flex-col items-center">
                    <div className="flex items-center gap-3 text-xl md:text-2xl font-black uppercase italic opacity-60 text-black relative z-10">
                        <Calendar size={24} strokeWidth={2.5} />
                        <span>{DASHBOARD_CONTENT.unlockDate === '2026-02-14' ? "Valentine's Day 2026" : DASHBOARD_CONTENT.unlockDate}</span>
                    </div>

                    {/* Local Heart Particle Effect - Preserved */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-[50]">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 0, x: (i - 2.5) * 40, opacity: 0, scale: 0 }}
                                animate={{
                                    y: [-20, -150],
                                    x: (i - 2.5) * 40 + (Math.random() * 20 - 10),
                                    opacity: [0, 1, 0],
                                    scale: [0.5, 1.2, 0.8]
                                }}
                                transition={{
                                    duration: 2 + Math.random(),
                                    repeat: Infinity,
                                    delay: i * 0.4,
                                    ease: "easeOut"
                                }}
                                className="absolute text-pink-500"
                            >
                                <Heart size={18} fill="currentColor" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Comic dots decoration */}
                <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-1 opacity-20">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-black rounded-full" />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default CountdownScreen;
