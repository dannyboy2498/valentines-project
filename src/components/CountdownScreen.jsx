import React from 'react';
import { Clock, Calendar, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const CountdownScreen = ({ timeRemaining }) => {
    const seconds = Math.floor((timeRemaining / 1000) % 60);
    const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
    const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

    const TimeUnit = ({ label, value }) => (
        <div className="flex flex-col items-center justify-center p-4 border-[6px] border-black bg-white shadow-[8px_8px_0px_0px_#000] min-w-[100px]">
            <span className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none text-black">
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-xs font-black uppercase mt-2 tracking-widest text-black/60">
                {label}
            </span>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen px-4 bg-transparent relative select-none overflow-hidden text-black">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white border-[8px] border-black p-10 shadow-[25px_25px_0px_0px_#000] max-w-2xl w-full text-center flex flex-col items-center relative"
            >
                {/* Decorative Badge */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white font-black py-2 px-8 border-[6px] border-black shadow-[8px_8px_0px_0px_#000] transform -rotate-2 z-10">
                    <span className="text-xl italic uppercase">Wait for it...</span>
                </div>

                <div className="w-full flex flex-col items-center mb-8">
                    <div className="mb-6 bg-pink-100 border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#000] relative">
                        <Clock size={80} className="text-black animate-pulse" />
                        {/* Small floating hearts */}
                        <motion.div
                            animate={{ y: [-10, -30], opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                            className="absolute top-0 right-0"
                        >
                            <Heart size={24} className="text-red-500 fill-red-500" />
                        </motion.div>
                        <motion.div
                            animate={{ y: [-10, -40], opacity: [0, 1, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                            className="absolute -top-4 left-0"
                        >
                            <Heart size={32} className="text-red-400 fill-red-400" />
                        </motion.div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-8 uppercase leading-tight tracking-tighter border-b-[8px] border-black pb-8 w-full">
                        Something Special Is Coming...
                    </h1>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mb-10 px-4">
                    <TimeUnit label="Days" value={days} />
                    <TimeUnit label="Hours" value={hours} />
                    <TimeUnit label="Mins" value={minutes} />
                    <TimeUnit label="Secs" value={seconds} />
                </div>

                <div className="flex items-center gap-3 text-xl font-bold uppercase italic opacity-60">
                    <Calendar size={24} />
                    <span>Valentine's Day 2026</span>
                </div>

                {/* Comic dots/texture decoration */}
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
