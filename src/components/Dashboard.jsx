import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reasons } from '../data/reasons';
import { Heart, Camera, Images, BookHeart, Star, Home, ChevronRight, ChevronLeft } from 'lucide-react';
import FireworksOverlay from './FireworksOverlay';
import { IMAGE_ASSETS } from '../config/assets';
import { DASHBOARD_CONTENT } from '../config/content';

const Dashboard = ({ showFireworks = true }) => {
    const [activeTab, setActiveTab] = useState('cover'); // 'cover' | 'reasons' | 'memories'
    const [discoveredTabs, setDiscoveredTabs] = useState(new Set(['cover']));
    const [currentReason, setCurrentReason] = useState(reasons[0]);
    const [isHovered, setIsHovered] = useState(false);

    const tabs = ['cover', 'reasons', 'memories'];
    const tabToIndex = { 'cover': 0, 'reasons': 1, 'memories': 2 };

    const getNewReason = (e) => {
        e.stopPropagation();
        let newReason = currentReason;
        while (reasons.length > 1 && newReason === currentReason) {
            const randomIndex = Math.floor(Math.random() * reasons.length);
            newReason = reasons[randomIndex];
        }
        setCurrentReason(newReason);
    };


    const [direction, setDirection] = useState(0);

    const handleTabChange = (newTab) => {
        const nextIdx = tabToIndex[newTab];
        const currIdx = tabToIndex[activeTab];
        setDirection(nextIdx - currIdx);
        setActiveTab(newTab);
        setDiscoveredTabs(prev => new Set([...prev, newTab]));
    };

    const navigate = (dir) => {
        const currIdx = tabToIndex[activeTab];
        let nextIdx = currIdx + dir;
        if (nextIdx < 0) nextIdx = 0;
        if (nextIdx >= tabs.length) return; // End of list
        handleTabChange(tabs[nextIdx]);
    };

    const handleCardClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;

        // If clicked left 30%, go back
        if (x < width * 0.3) {
            navigate(-1);
        } else {
            // Otherwise go forward
            navigate(1);
        }
    };

    // SNAPPY page transitions
    const pageVariants = {
        initial: (direction) => ({
            opacity: 0,
            x: direction > 0 ? 600 : -600,
            rotateY: direction > 0 ? 35 : -35,
            scale: 0.95
        }),
        animate: {
            opacity: 1,
            x: 0,
            rotateY: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
            }
        },
        exit: (direction) => ({
            opacity: 0,
            x: direction < 0 ? 600 : -600,
            rotateY: direction < 0 ? 35 : -35,
            scale: 0.95,
            transition: { duration: 0.25 }
        })
    };

    return (
        <div className="min-h-screen pt-20 pb-32 px-4 flex flex-col items-center justify-start bg-pink-50 overflow-x-hidden relative">
            {showFireworks && <FireworksOverlay />}

            {/* THE VIEW DECK CONTAINER */}
            <div
                className="relative w-full max-w-lg h-[700px] z-10 flex items-center justify-center perspective-1000"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleCardClick}
            >
                {/* FLOATING RIBBON */}
                <div className="absolute -top-6 -right-12 rotate-[15deg] z-[100] pointer-events-none">
                    <div className="bg-pink-500 text-white font-black uppercase px-12 py-3 border-4 border-black shadow-[8px_8px_0px_0px_#000] whitespace-nowrap text-xs tracking-widest">
                        Wait, There's More...
                    </div>
                </div>

                {/* NAVIGATION ARROW HINT */}
                <AnimatePresence>
                    {isHovered && activeTab !== 'memories' && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="absolute -right-16 top-1/2 -translate-y-1/2 z-50 text-pink-500 animate-pulse hidden md:block"
                        >
                            <ChevronRight size={64} strokeWidth={3} />
                        </motion.div>
                    )}
                    {isHovered && activeTab !== 'cover' && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="absolute -left-16 top-1/2 -translate-y-1/2 z-50 text-gray-400 animate-pulse hidden md:block"
                        >
                            <ChevronLeft size={64} strokeWidth={3} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence initial={false} custom={direction} mode="wait">
                    {activeTab === 'cover' && (
                        <motion.div
                            key="cover"
                            custom={direction}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className={`absolute inset-0 w-full h-full bg-white border-[8px] border-black p-8 flex flex-col transition-all duration-300 ${isHovered ? 'shadow-[40px_40px_0px_0px_rgba(0,0,0,0.2)] -translate-x-2 -translate-y-2' : 'shadow-[20px_20px_0px_0px_#000]'}`}
                        >
                            {/* LONG CAT PHOTO (78% height) */}
                            <div className="w-full h-[78%] border-4 border-black overflow-hidden bg-gray-100 mb-4 relative">
                                <img src={IMAGE_ASSETS.dashboard_hero} alt="Cover" className="w-full h-full object-cover" />
                                {isHovered && (
                                    <div className="absolute inset-0 bg-pink-500/10 flex items-center justify-center">
                                        <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000] -rotate-2">
                                            <p className="font-black uppercase text-xl">Click to see inside!</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="text-center flex-grow flex flex-col items-center justify-center">
                                <Heart size={36} className="text-red-500 fill-red-500 mb-1" />
                                <h1 className="text-3xl font-black uppercase tracking-tighter">She Said Yes!</h1>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'reasons' && (
                        <motion.div
                            key="reasons"
                            custom={direction}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className={`absolute inset-0 w-full h-full bg-white border-[8px] border-black p-8 flex flex-col overflow-y-auto no-scrollbar transition-all duration-300 ${isHovered ? 'shadow-[40px_40px_0px_0px_rgba(0,0,0,0.2)] -translate-x-2 -translate-y-2' : 'shadow-[20px_20px_0px_0px_#000]'}`}
                        >
                            <div className="space-y-8">
                                {/* 1. REASONS AT TOP */}
                                <div className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_#000]">
                                    <h2 className="text-lg font-black mb-4 uppercase flex items-center gap-2">
                                        <Star size={18} fill="#facc15" className="text-yellow-500" />
                                        Reasons Why I Love You:
                                    </h2>
                                    <div className="min-h-[140px] flex items-center justify-center border-4 border-black p-4 bg-pink-50 relative overflow-hidden">
                                        <AnimatePresence mode='wait'>
                                            <motion.p
                                                key={currentReason}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 1.1 }}
                                                className="text-2xl font-black italic text-center relative z-10"
                                            >
                                                {currentReason}
                                            </motion.p>
                                        </AnimatePresence>
                                        <div className="absolute top-2 left-2 opacity-10 pointer-events-none">
                                            <Heart size={40} fill="currentColor" className="text-pink-300" />
                                        </div>
                                    </div>
                                    <button
                                        onClick={getNewReason}
                                        className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-black py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase"
                                    >
                                        TELL ME ANOTHER
                                    </button>
                                </div>

                                {/* 2. MESSAGE BELOW */}
                                <div className="border-4 border-black p-6 bg-pink-50 shadow-[6px_6px_0px_0px_#000]">
                                    <div className="flex items-center gap-3 mb-4 pb-2 border-b-4 border-black/10">
                                        <Heart size={24} fill="#ec4899" className="text-pink-500" />
                                        <h2 className="text-xl font-black uppercase italic">{DASHBOARD_CONTENT.messageTitle}</h2>
                                    </div>

                                    <p className="text-lg font-black italic text-gray-800 leading-tight mb-8">
                                        {DASHBOARD_CONTENT.personalMessage}
                                    </p>

                                    {/* 3. SIGNATURE */}
                                    <div className="text-right border-t-2 border-black/5 pt-4">
                                        <p className="font-black text-pink-600 text-xl italic">{DASHBOARD_CONTENT.signature}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'memories' && (
                        <motion.div
                            key="memories"
                            custom={direction}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className={`absolute inset-0 w-full h-full bg-white border-[8px] border-black p-8 flex flex-col overflow-y-auto no-scrollbar transition-all duration-300 ${isHovered ? 'shadow-[40px_40px_0px_0px_rgba(0,0,0,0.2)] -translate-x-2 -translate-y-2' : 'shadow-[20px_20px_0px_0px_#000]'}`}
                        >
                            <div className="flex items-center gap-3 mb-6 pb-2 border-b-6 border-black">
                                <Camera size={28} className="text-yellow-500" />
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Memories</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="aspect-square border-4 border-black bg-gray-100 flex items-center justify-center shadow-[4px_4px_0px_0px_#000] group relative overflow-hidden">
                                        <Star className="text-gray-300 group-hover:text-yellow-400 transition-colors" size={32} />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 border-4 border-black p-4 bg-white shadow-[6px_6px_0px_0px_#000] text-center italic text-xs font-black uppercase text-gray-400">{DASHBOARD_CONTENT.loadingText}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* GLOBAL NAVIGATION BAR */}
            <div className="fixed bottom-8 left-0 w-full flex justify-center z-50 pointer-events-none px-4">
                <motion.div
                    layout
                    className="flex items-center gap-4 pointer-events-auto bg-white/95 backdrop-blur-sm border-4 border-black p-3 shadow-[8px_8px_0px_0px_#000]"
                >
                    {/* Discovery Icons */}
                    {tabs.map((tab) => {
                        const Icon = tab === 'cover' ? Home : tab === 'reasons' ? BookHeart : Images;
                        const isDiscovered = discoveredTabs.has(tab);
                        const isActive = activeTab === tab;
                        const colorClass = tab === 'reasons' ? 'bg-pink-500' : tab === 'memories' ? 'bg-yellow-400' : 'bg-black';
                        const textColor = tab === 'memories' ? 'text-black' : 'text-white';

                        if (!isDiscovered) return null;

                        return (
                            <motion.button
                                key={tab}
                                layout
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                onClick={() => handleTabChange(tab)}
                                className={`p-3 border-4 border-black transition-all ${isActive ? `${colorClass} ${textColor}` : 'bg-white hover:bg-pink-50 shadow-[2px_2px_0px_0px_#000]'}`}
                            >
                                <Icon size={24} />
                            </motion.button>
                        );
                    })}

                    {/* Discovery Dots (even spacing) */}
                    {tabs.some(tab => !discoveredTabs.has(tab)) && (
                        <div className="flex items-center gap-3 px-2">
                            {tabs.map((tab) => !discoveredTabs.has(tab) && (
                                <motion.div
                                    key={tab}
                                    layout
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-3 h-3 rounded-full bg-gray-300 border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .perspective-1000 { perspective: 1000px; }
            `}} />
        </div>
    );
};

export default Dashboard;
