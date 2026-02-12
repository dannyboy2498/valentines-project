import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reasons } from '../data/reasons';
import { Heart, ChevronLeft, Camera, Images, BookHeart, Star } from 'lucide-react';
import useTimeGate from '../hooks/useTimeGate';
import FireworksOverlay from './FireworksOverlay';
import { IMAGE_ASSETS } from '../config/assets';

const Dashboard = ({ showFireworks = true }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [activePage, setActivePage] = useState('reasons');
    const [currentReason, setCurrentReason] = useState(reasons[0]);

    const getNewReason = (e) => {
        e.stopPropagation();
        let newReason = currentReason;
        while (reasons.length > 1 && newReason === currentReason) {
            const randomIndex = Math.floor(Math.random() * reasons.length);
            newReason = reasons[randomIndex];
        }
        setCurrentReason(newReason);
    };

    const personalMessage = "My Dearest, clicking 'Yes' was the best choice you could have made! I'm so lucky to have you. I can't wait for our future together. ❤️";

    return (
        <div className="min-h-screen py-24 px-4 flex flex-col items-center justify-start bg-pink-50 overflow-x-hidden relative">
            {showFireworks && <FireworksOverlay />}

            {/* CARD CONTAINER */}
            <div
                className="relative w-full max-w-lg cursor-pointer z-50"
                style={{ height: '750px', perspective: '2000px' }}
                onClick={() => !isOpen && setIsOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.div
                    className="w-full h-full relative"
                    initial={false}
                    animate={{
                        rotateY: isOpen ? 180 : 0,
                        scale: isHovered && !isOpen ? 1.02 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* FRONT SIDE (The Cover) */}
                    <div
                        className={`absolute inset-0 w-full h-full bg-white border-[8px] border-black p-8 flex flex-col transition-all duration-300 overflow-hidden ${isHovered && !isOpen ? 'shadow-[30px_30px_0px_0px_#000]' : 'shadow-[20px_20px_0px_0px_#000]'}`}
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            zIndex: 2
                        }}
                    >
                        {/* HERO IMAGE AT TOP (LONGER to close whitespace) */}
                        <div className="w-full h-[78%] border-4 border-black overflow-hidden bg-gray-100 mb-4 relative group">
                            <img
                                src={IMAGE_ASSETS.dashboard_hero}
                                alt="Dashboard Hero"
                                className={`w-full h-full object-cover transition-transform duration-500 ${isHovered && !isOpen ? 'scale-105' : 'scale-100'}`}
                            />

                            {/* HOVER OVERLAY */}
                            <AnimatePresence>
                                {isHovered && !isOpen && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-pink-500/20 flex items-center justify-center p-4 text-center pointer-events-none"
                                    >
                                        <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000] -rotate-2">
                                            <p className="font-black uppercase text-xl leading-tight">Click to see inside!</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* HEADER STYLE - AT BOTTOM */}
                        <div className="text-center flex-grow flex flex-col items-center justify-center">
                            <Heart size={36} className={`text-red-500 fill-red-500 mb-1 transition-transform duration-300 ${isHovered && !isOpen ? 'scale-110' : 'scale-100'}`} />
                            <h1 className="text-3xl font-black uppercase tracking-tighter">She Said Yes!</h1>
                        </div>

                        {/* PERMANENT DIAGONAL BADGE - RIBBONING BOTTOM RIGHT CORNER */}
                        <div className="absolute -bottom-6 -right-10 -rotate-[35deg] z-30 pointer-events-none">
                            <div className="bg-pink-500 text-white font-black uppercase px-12 py-3 border-4 border-black shadow-[6px_6px_0px_0px_#000] whitespace-nowrap text-xs tracking-widest">
                                Wait, There's More...
                            </div>
                        </div>
                    </div>

                    {/* BACK SIDE (Inside Dashboard) */}
                    <div
                        className="absolute inset-0 w-full h-full bg-white border-[8px] border-black shadow-[-20px_20px_0px_0px_#000] p-8 flex flex-col"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            zIndex: 1
                        }}
                    >
                        {/* DASHBOARD HEADER */}
                        <div className="flex items-center justify-between mb-6 pb-2 border-b-6 border-black">
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                className="bg-pink-100 border-4 border-black p-1 hover:bg-pink-200 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <h2 className="text-xl font-black uppercase italic tracking-tighter">
                                {activePage === 'reasons' ? 'Our Story' : 'Memories'}
                            </h2>
                            <div className="w-10" />
                        </div>

                        {/* PAGE CONTENT AREA */}
                        <div className="flex-grow overflow-y-auto no-scrollbar pb-16">
                            <AnimatePresence mode='wait'>
                                {activePage === 'reasons' ? (
                                    <motion.div
                                        key="reasons-page"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="border-4 border-black p-6 bg-pink-50 shadow-[6px_6px_0px_0px_#000]">
                                            <p className="text-lg font-black italic text-gray-800 leading-tight">
                                                "{personalMessage}"
                                            </p>
                                        </div>

                                        <div className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_#000]">
                                            <h2 className="text-lg font-black mb-4 uppercase">Reasons Why I Love You:</h2>
                                            <div className="min-h-[140px] flex items-center justify-center border-4 border-black p-4 bg-pink-50">
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
                                                className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-black py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase"
                                            >
                                                TELL ME ANOTHER
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="memories-page"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="border-4 border-black p-4 bg-yellow-50 shadow-[6px_6px_0px_0px_#000] text-center">
                                            <h2 className="text-xl font-black uppercase mb-2 flex items-center justify-center gap-2">
                                                <Camera size={24} />
                                                Shared Moments
                                            </h2>
                                            <p className="text-sm font-bold text-gray-600 italic">Capturing everything since Day 1</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="aspect-square border-4 border-black bg-gray-100 flex items-center justify-center shadow-[4px_4px_0px_0px_#000] relative overflow-hidden group">
                                                    <Star className="text-gray-300 group-hover:text-yellow-400 transition-colors" size={32} />
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* CAROUSEL CONTROLS */}
                        <div className="absolute bottom-6 left-0 w-full flex justify-center gap-10 pointer-events-auto z-50">
                            <button
                                onClick={(e) => { e.stopPropagation(); setActivePage('reasons'); }}
                                className={`p-4 border-4 border-black transition-all ${activePage === 'reasons' ? 'bg-pink-500 text-white shadow-none translate-x-1 translate-y-1' : 'bg-white shadow-[6px_6px_0px_0px_#000]'}`}
                            >
                                <BookHeart size={28} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setActivePage('memories'); }}
                                className={`p-4 border-4 border-black transition-all ${activePage === 'memories' ? 'bg-pink-500 text-white shadow-none translate-x-1 translate-y-1' : 'bg-white shadow-[6px_6px_0px_0px_#000]'}`}
                            >
                                <Images size={28} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
};

export default Dashboard;
