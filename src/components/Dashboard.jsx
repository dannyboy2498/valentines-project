import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reasons } from '../data/reasons';
import { Heart, Camera, Images, BookHeart, Star, Home, ChevronRight, ChevronLeft, Play } from 'lucide-react';
import FireworksOverlay from './FireworksOverlay';
import { IMAGE_ASSETS } from '../config/assets';
import { DASHBOARD_CONTENT } from '../config/content';
import HeartParticles from './HeartParticles';

const MemoryItem = ({ item, index }) => {
    const [isWide, setIsWide] = useState(false);
    const videoRef = useRef(null);
    const url = item.url;

    // Robust video detection: ignore query params and handle common formats
    const isVideo = /\.(mp4|webm|mov|ogg|m4v|quicktime)($|\?)/i.test(url);

    const checkWide = (w, h) => {
        if (w > h * 1.2) setIsWide(true);
    };

    return (
        <div
            className={`${isWide ? 'col-span-2 aspect-video' : 'aspect-square'} border-[3px] lg:border-4 border-black bg-gray-100 shadow-[3px_3px_0px_0px_#000] lg:shadow-[4px_4px_0px_0px_#000] relative overflow-hidden group transition-all duration-300 ease-out`}
            onMouseEnter={() => {
                if (videoRef.current) {
                    videoRef.current.muted = false;
                    videoRef.current.play().catch(() => { });
                }
            }}
            onMouseLeave={() => {
                if (videoRef.current) {
                    videoRef.current.muted = true;
                }
            }}
        >
            {isVideo ? (
                <video
                    ref={videoRef}
                    onLoadedMetadata={(e) => checkWide(e.target.videoWidth, e.target.videoHeight)}
                    onError={(e) => console.error("Video failed to load:", url, e)}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                    className="w-full h-full object-cover"
                >
                    <source src={url} type="video/mp4; codecs='avc1.42E01E, mp4a.40.2'" />
                    <source src={url} type="video/mp4" />
                    <source src={url} type="video/quicktime" />
                    <source src={url} />
                </video>
            ) : (
                <img
                    src={url}
                    alt={`Memory ${index + 1}`}
                    onLoad={(e) => checkWide(e.target.naturalWidth, e.target.naturalHeight)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            )}

            {isVideo && (
                <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md text-white p-1.5 rounded-full pointer-events-none ring-1 ring-white/20">
                    <Play size={10} fill="currentColor" />
                </div>
            )}
        </div>
    );
};

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
        const availableReasons = reasons;
        while (availableReasons.length > 1 && newReason === currentReason) {
            const randomIndex = Math.floor(Math.random() * availableReasons.length);
            newReason = availableReasons[randomIndex];
        }
        setCurrentReason(newReason);
    };


    const [direction, setDirection] = useState(0);
    const [hoverZone, setHoverZone] = useState(null); // 'left' | 'middle' | 'right' | null

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

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        if (!clientX) return;

        const x = clientX - rect.left;
        const width = rect.width;

        if (x < width * 0.3) setHoverZone('left');
        else if (x > width * 0.7) setHoverZone('right');
        else setHoverZone('middle');
    };

    const handleCardClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        if (!clientX) return;

        const x = clientX - rect.left;
        const width = rect.width;

        // If clicked middle and undiscovered content exists, go forward
        if (x >= width * 0.3 && x <= width * 0.7 && discoveredTabs.size < tabs.length) {
            navigate(1);
        } else if (x < width * 0.3) {
            navigate(-1);
        } else {
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
        <div className="min-h-full w-full pt-12 lg:pt-20 pb-32 px-4 flex flex-col items-center justify-start bg-transparent overflow-visible relative">
            <HeartParticles zIndex={0} />
            {showFireworks && <FireworksOverlay />}

            {/* THE VIEW DECK CONTAINER */}
            <div
                className="relative w-full max-w-lg h-[550px] lg:h-[700px] z-10 flex items-center justify-center perspective-1000"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setHoverZone(null);
                }}
                onMouseMove={handleMouseMove}
                onTouchStart={() => setIsHovered(true)}
                onTouchEnd={(e) => {
                    setIsHovered(false);
                    setHoverZone(null);
                    handleCardClick(e);
                }}
                onClick={(e) => {
                    // Prevent double-fire if handled by touch
                    if (e.type === 'click' && 'ontouchstart' in window) return;
                    handleCardClick(e);
                }}
            >
                {/* FLOATING RIBBON - Only show if there's undiscovered content */}
                <AnimatePresence>
                    {discoveredTabs.size < tabs.length && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0, rotate: 0 }}
                            animate={{ opacity: 1, scale: 1, rotate: 15 }}
                            exit={{ opacity: 0, scale: 0, rotate: 0 }}
                            className="absolute -top-4 lg:-top-6 -right-6 lg:-right-12 z-[100] pointer-events-none"
                        >
                            <div className="bg-pink-500 text-white font-black uppercase px-6 lg:px-12 py-2 lg:py-3 border-[3px] lg:border-4 border-black shadow-[4px_4px_0px_0px_#000] lg:shadow-[8px_8px_0px_0px_#000] whitespace-nowrap text-[10px] lg:text-xs tracking-widest">
                                Wait, There's More...
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* NAVIGATION ARROW HINT - DYNAMIC COLORS */}
                <AnimatePresence>
                    {isHovered && activeTab !== 'memories' && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className={`absolute -right-12 lg:-right-16 top-1/2 -translate-y-1/2 z-50 animate-pulse hidden lg:block transition-colors duration-200 ${hoverZone === 'right' || hoverZone === 'middle' ? 'text-pink-500' : 'text-gray-300'
                                }`}
                        >
                            <ChevronRight size={48} lg:size={64} strokeWidth={3} />
                        </motion.div>
                    )}
                    {isHovered && activeTab !== 'cover' && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className={`absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2 z-50 animate-pulse hidden lg:block transition-colors duration-200 ${hoverZone === 'left' ? 'text-pink-500' : 'text-gray-300'
                                }`}
                        >
                            <ChevronLeft size={48} lg:size={64} strokeWidth={3} />
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
                            className={`absolute inset-0 w-full h-full bg-white border-[6px] lg:border-[8px] border-black p-4 lg:p-8 flex flex-col transition-all duration-300 ${isHovered ? 'shadow-[20px_20px_0px_0px_rgba(0,0,0,0.2)] lg:shadow-[40px_40px_0px_0px_rgba(0,0,0,0.2)] -translate-x-1 lg:-translate-x-2 -translate-y-1 lg:-translate-y-2' : 'shadow-[15px_15px_0px_0px_#000] lg:shadow-[20px_20px_0px_0px_#000]'}`}
                        >
                            {/* LONG CAT PHOTO (78% height) */}
                            <div className="w-full h-[70%] lg:h-[78%] border-[3px] lg:border-4 border-black overflow-hidden bg-gray-100 mb-4 relative">
                                <img src={IMAGE_ASSETS.dashboard_hero} alt="Cover" className="w-full h-full object-cover" />
                                {isHovered && (
                                    <div className="absolute inset-0 bg-pink-500/10 flex items-center justify-center">
                                        <div className="bg-white border-[3px] lg:border-4 border-black p-3 lg:p-4 shadow-[4px_4px_0px_0px_#000] lg:shadow-[6px_6px_0px_0px_#000] -rotate-2">
                                            <p className="font-black uppercase text-sm lg:text-xl">Click to see inside!</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="text-center flex-grow flex flex-col items-center justify-center">
                                <Heart size={24} lg:size={36} className="text-red-500 fill-red-500 mb-1" />
                                <h1 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter">{DASHBOARD_CONTENT.pronoun} Said Yes!</h1>
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
                            className={`absolute inset-0 w-full h-full bg-white border-[6px] lg:border-[8px] border-black p-4 lg:p-8 flex flex-col overflow-y-auto no-scrollbar transition-all duration-300 ${isHovered ? 'shadow-[20px_20px_0px_0px_rgba(0,0,0,0.2)] lg:shadow-[40px_40px_0px_0px_rgba(0,0,0,0.2)] -translate-x-1 lg:-translate-x-2 -translate-y-1 lg:-translate-y-2' : 'shadow-[15px_15px_0px_0px_#000] lg:shadow-[20px_20px_0px_0px_#000]'}`}
                        >
                            <div className="space-y-4 lg:space-y-6">
                                {/* COMPACT HEADER */}
                                <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-4 pb-1 lg:pb-2 border-b-[4px] lg:border-b-6 border-black">
                                    <Heart size={20} lg:size={28} fill="#ec4899" className="text-pink-500" />
                                    <h2 className="text-lg lg:text-2xl font-black uppercase italic tracking-tighter">{DASHBOARD_CONTENT.messageTitle}</h2>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border-[3px] lg:border-4 border-black p-4 bg-yellow-400 shadow-[4px_4px_0px_0px_#000] lg:shadow-[6px_6px_0px_0px_#000] rotate-1"
                                >
                                    <p className="text-lg lg:text-xl font-black uppercase text-center tracking-tighter">
                                        Saying 'Yes' was the best choice you ever made!
                                    </p>
                                </motion.div>

                                {/* REASONS BOX (NOW ABOVE MESSAGE) */}
                                <div className="border-[3px] lg:border-4 border-black p-4 lg:p-6 bg-white shadow-[4px_4px_0px_0px_#000] lg:shadow-[6px_6px_0px_0px_#000]">
                                    <h2 className="text-xs lg:text-lg font-black mb-2 lg:mb-4 uppercase tracking-tighter lg:tracking-normal">Reasons Why I Love You:</h2>
                                    <div className="min-h-[100px] lg:min-h-[140px] flex items-center justify-center border-[3px] lg:border-4 border-black p-3 lg:p-4 bg-pink-50 relative overflow-hidden">
                                        <AnimatePresence mode='wait'>
                                            <motion.p
                                                key={currentReason}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="text-lg lg:text-2xl font-black italic text-center relative z-10 leading-tight"
                                                dangerouslySetInnerHTML={{
                                                    __html: currentReason
                                                        .replace(/\\n/g, '<br/>')
                                                        .replace(/\n/g, '<br/>')
                                                        .replace(/\*\*(.*?)\*\*/g, '<span class="text-pink-600 font-black">$1</span>')
                                                }}
                                            />
                                        </AnimatePresence>
                                        <div className="absolute top-1 left-1 lg:top-2 lg:left-2 opacity-5">
                                            <Heart size={24} lg:size={40} fill="currentColor" className="text-pink-300" />
                                        </div>
                                    </div>
                                    <button
                                        onClick={getNewReason}
                                        className="mt-4 lg:mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-black py-3 lg:py-4 border-[3px] lg:border-4 border-black shadow-[3px_3px_0px_0px_#000] lg:shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase text-xs lg:text-base tracking-widest"
                                    >
                                        TELL ME ANOTHER
                                    </button>
                                </div>

                                {/* MESSAGE BOX (NOW BELOW REASONS) */}
                                <div className="border-[3px] lg:border-4 border-black p-4 lg:p-6 bg-violet-50 shadow-[4px_4px_0px_0px_#000] lg:shadow-[6px_6px_0px_0px_#000]">
                                    <p
                                        className="text-sm lg:text-lg font-black italic text-gray-800 leading-[1.2] lg:leading-tight mb-4 lg:mb-8"
                                        dangerouslySetInnerHTML={{
                                            __html: DASHBOARD_CONTENT.personalMessage
                                                .replace(/\\n/g, '<br/>')
                                                .replace(/\n/g, '<br/>')
                                                .replace(/\*\*(.*?)\*\*/g, '<span class="text-pink-600 font-black">$1</span>')
                                        }}
                                    />
                                    <div className="text-right border-t-[2px] border-black/10 pt-2 lg:pt-4">
                                        <p className="font-black text-pink-600 text-base lg:text-xl italic">{DASHBOARD_CONTENT.signature}</p>
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
                            className={`absolute inset-0 w-full h-full bg-white border-[6px] lg:border-[8px] border-black p-4 lg:p-8 flex flex-col overflow-hidden transition-all duration-300 ${isHovered ? 'shadow-[20px_20px_0px_0px_rgba(0,0,0,0.2)] lg:shadow-[40px_40px_0px_0px_rgba(0,0,0,0.2)] -translate-x-1 lg:-translate-x-2 -translate-y-1 lg:-translate-y-2' : 'shadow-[15px_15px_0px_0px_#000] lg:shadow-[20px_20px_0px_0px_#000]'}`}
                        >
                            <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6 pb-1 lg:pb-2 border-b-[4px] lg:border-b-6 border-black shrink-0">
                                <Camera size={20} lg:size={28} className="text-yellow-500" />
                                <h2 className="text-lg lg:text-2xl font-black uppercase italic tracking-tighter">Memories</h2>
                            </div>

                            {/* Scrollable Gallery Area */}
                            <div className="flex-grow overflow-y-auto no-scrollbar pr-1">
                                <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6">
                                    {DASHBOARD_CONTENT.memories.length > 0 ? (
                                        DASHBOARD_CONTENT.memories.map((item, i) => (
                                            item.type === 'header' ? (
                                                <div key={i} className="col-span-2 border-[3px] lg:border-4 border-black p-3 lg:p-4 bg-yellow-400 shadow-[5px_5px_0px_0px_#000] lg:shadow-[8px_8px_0px_0px_#000] mt-6 mb-4 first:mt-0 rotate-[-1deg] relative z-10">
                                                    <p className="text-sm lg:text-xl font-black uppercase text-center tracking-tighter italic leading-none">
                                                        {item.text}
                                                    </p>
                                                </div>
                                            ) : (
                                                <MemoryItem key={i} item={item} index={i} />
                                            )
                                        ))
                                    ) : (
                                        [1, 2, 3, 4, 5, 6].map((i) => (
                                            <div key={i} className="aspect-square border-[3px] lg:border-4 border-black bg-gray-100 flex items-center justify-center shadow-[3px_3px_0px_0px_#000] lg:shadow-[4px_4px_0px_0px_#000] group relative overflow-hidden">
                                                <Star className="text-gray-300 group-hover:text-yellow-400 transition-colors" size={24} lg:size={32} />
                                            </div>
                                        ))
                                    )}
                                </div>

                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* GLOBAL NAVIGATION BAR - Now Absolute to scale with AppScaler */}
            <div className="absolute bottom-6 lg:bottom-8 left-0 w-full flex justify-center z-50 pointer-events-none px-4">
                <motion.div
                    layout
                    className="flex items-center gap-3 lg:gap-4 pointer-events-auto bg-white/95 backdrop-blur-sm border-[3px] lg:border-4 border-black p-2 lg:p-3 shadow-[6px_6px_0px_0px_#000] lg:shadow-[8px_8px_0px_0px_#000]"
                >
                    {tabs.map((tab, idx) => {
                        const Icon = tab === 'cover' ? Home : tab === 'reasons' ? BookHeart : Images;
                        const isDiscovered = discoveredTabs.has(tab);
                        const isActive = activeTab === tab;

                        // ONLY show the button if it's discovered OR if it's the NEXT one to discover
                        const isNextToDiscover = !isDiscovered && tabs.findIndex(t => !discoveredTabs.has(t)) === idx;

                        if (!isDiscovered && !isNextToDiscover) return null;

                        const colorClass = tab === 'reasons' ? 'bg-pink-500' : tab === 'memories' ? 'bg-yellow-400' : 'bg-black';
                        const textColor = tab === 'memories' ? 'text-black' : 'text-white';

                        return (
                            <motion.button
                                key={tab}
                                layoutId={`nav-${tab}`}
                                onClick={() => isDiscovered && handleTabChange(tab)}
                                className={`w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center transition-all ${!isDiscovered
                                    ? 'bg-transparent border-none cursor-default'
                                    : `border-[3px] lg:border-4 border-black ${isActive
                                        ? `${colorClass} ${textColor} shadow-none translate-x-1 translate-y-1`
                                        : 'bg-white hover:bg-pink-50 shadow-[3px_3px_0px_0px_#000] lg:shadow-[4px_4px_0px_0px_#000]'}`
                                    }`}
                            >
                                {isDiscovered ? (
                                    <Icon size={24} lg:size={28} />
                                ) : (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-8 h-8 lg:w-9 lg:h-9 bg-gray-200 border-[3px] lg:border-4 border-black shadow-[2px_2px_0px_0px_#000] rotate-6"
                                    />
                                )}
                            </motion.button>
                        );
                    })}
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
