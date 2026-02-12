import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reasons } from '../data/reasons';
import { Heart, MapPin } from 'lucide-react';
import useTimeGate from '../hooks/useTimeGate';
import FireworksOverlay from './FireworksOverlay';

const Dashboard = ({ showFireworks = true }) => {
    const [currentReason, setCurrentReason] = useState(reasons[0]);
    const nextVisitDate = '2026-03-01T12:00:00';
    const { timeRemaining } = useTimeGate(nextVisitDate);

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);

    const getNewReason = () => {
        let newReason = currentReason;
        while (reasons.length > 1 && newReason === currentReason) {
            const randomIndex = Math.floor(Math.random() * reasons.length);
            newReason = reasons[randomIndex];
        }
        setCurrentReason(newReason);
    };

    return (
        <div className="min-h-screen py-10 px-4 flex flex-col items-center bg-pink-50 overflow-x-hidden">
            {showFireworks && <FireworksOverlay />}
            <div className="max-w-xl w-full border-8 border-black bg-white p-8 shadow-[15px_15px_0px_0px_#000] relative z-10">
                <header className="text-center mb-12 border-b-8 border-black pb-8">
                    <Heart size={64} className="text-red-500 fill-red-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-black uppercase">She Said Yes!</h1>
                </header>

                <div className="space-y-8">
                    <div className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_#000]">
                        <h2 className="text-xl font-black mb-6 uppercase">Why I Love You:</h2>
                        <div className="min-h-[120px] flex items-center justify-center border-4 border-black p-4 bg-pink-50">
                            <AnimatePresence mode='wait'>
                                <motion.p
                                    key={currentReason}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-2xl font-black italic text-center"
                                >
                                    "{currentReason}"
                                </motion.p>
                            </AnimatePresence>
                        </div>
                        <button
                            onClick={getNewReason}
                            className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-black py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                        >
                            TELL ME ANOTHER
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="border-4 border-black p-4 bg-white shadow-[8px_8px_0px_0px_#000]">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin size={20} />
                                <h3 className="text-xs font-black uppercase">Next Visit:</h3>
                            </div>
                            <div className="text-2xl font-black font-mono">
                                {days}D : {hours}H
                            </div>
                        </div>

                        <div className="border-4 border-black p-1 bg-white shadow-[8px_8px_0px_0px_#000]">
                            <img
                                src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400&h=300&fit=crop"
                                alt="Happy"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all border-2 border-black"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
