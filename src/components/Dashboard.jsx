import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reasons } from '../data/reasons';
import { Heart, MapPin, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import useTimeGate from '../hooks/useTimeGate';
import FireworksOverlay from './FireworksOverlay';
import { IMAGE_ASSETS } from '../config/assets';

const Dashboard = ({ showFireworks = true }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentReason, setCurrentReason] = useState(reasons[0]);

    const getNewReason = (e) => {
        e.stopPropagation(); // Prevent card from flipping when clicking button
        let newReason = currentReason;
        while (reasons.length > 1 && newReason === currentReason) {
            const randomIndex = Math.floor(Math.random() * reasons.length);
            newReason = reasons[randomIndex];
        }
        setCurrentReason(newReason);
    };

    return (
        <div className="min-h-screen py-10 px-4 flex flex-col items-center bg-pink-50 overflow-x-hidden transition-colors duration-500">
            {showFireworks && <FireworksOverlay />}

            <div className="perspective-1000 w-full max-w-xl h-[80vh] relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <motion.div
                    className="w-full h-full relative preserve-3d transition-all duration-700"
                    animate={{ rotateY: isOpen ? 180 : 0 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* FRONT OF CARD (The Cover) */}
                    <div className="absolute inset-0 backface-hidden w-full h-full bg-white border-8 border-black shadow-[15px_15px_0px_0px_#000] p-6 flex flex-col items-center justify-between z-10">
                        <div className="w-full h-[85%] border-4 border-black overflow-hidden bg-gray-100 flex items-center justify-center relative group">
                            <img
                                src={IMAGE_ASSETS.dashboard_hero}
                                alt="Dashboard Hero"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Overlay Hint */}
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000]">Wait, there's more...</span>
                            </div>
                        </div>

                        <div className="w-full flex items-center justify-center gap-4 py-4 mt-2">
                            <div className="h-[2px] flex-grow bg-black" />
                            <div className="flex items-center gap-2 animate-bounce">
                                <BookOpen size={24} className="text-pink-600" />
                                <span className="font-black uppercase tracking-widest text-xl">Click to Open</span>
                            </div>
                            <div className="h-[2px] flex-grow bg-black" />
                        </div>
                    </div>

                    {/* BACK OF CARD (The Inside) */}
                    <div
                        className="absolute inset-0 backface-hidden w-full h-full bg-white border-8 border-black shadow-[-15px_15px_0px_0px_#000] p-8 flex flex-col items-center z-0"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        {/* Tab to go back */}
                        <button
                            className="absolute top-4 left-4 bg-pink-200 hover:bg-pink-300 border-4 border-black p-2 shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none z-20"
                            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <header className="text-center mb-8 border-b-8 border-black pb-8 w-full">
                            <Heart size={48} className="text-red-500 fill-red-500 mx-auto mb-2" />
                            <h1 className="text-3xl font-black uppercase">She Said Yes!</h1>
                            <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-tighter italic">This is just the beginning...</p>
                        </header>

                        <div className="flex-grow flex flex-col justify-center w-full space-y-6">
                            <div className="border-4 border-black p-6 bg-pink-50 shadow-[8px_8px_0px_0px_#000] relative">
                                <h2 className="text-lg font-black mb-4 uppercase flex items-center gap-2">
                                    <Heart size={18} className="text-pink-600" />
                                    Why I Love You:
                                </h2>
                                <div className="min-h-[140px] flex items-center justify-center border-4 border-black p-6 bg-white shadow-inner">
                                    <AnimatePresence mode='wait'>
                                        <motion.p
                                            key={currentReason}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.1 }}
                                            className="text-2xl font-black italic text-center text-pink-700 leading-tight"
                                        >
                                            "{currentReason}"
                                        </motion.p>
                                    </AnimatePresence>
                                </div>

                                <button
                                    onClick={getNewReason}
                                    className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-black py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase text-lg"
                                >
                                    Tell Me More!
                                </button>
                            </div>

                            <div className="pt-4 text-center">
                                <p className="text-[10px] font-black uppercase text-gray-300">Hand-coded with love for my valentine</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Layout CSS injection for 3D flip */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .perspective-1000 {
                    perspective: 1500px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
            `}} />
        </div>
    );
};

export default Dashboard;
