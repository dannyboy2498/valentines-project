import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import MailSymbol from './MailSymbol';
import { IMAGE_ASSETS } from '../config/assets';

const MissingImage = ({ label }) => (
    <div className="w-[180px] h-[180px] md:w-[300px] md:h-[300px] bg-gray-200 border-4 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-500 font-black uppercase text-xs md:text-sm p-4 text-center italic">
        <AlertCircle size={32} className="mb-2" />
        <span>Missing {label}</span>
        <span className="text-[10px] mt-2 normal-case font-normal">(Drop in /public/images/)</span>
    </div>
);

const QuestionScreen = ({ onYes }) => {
    const [noCount, setNoCount] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVanish, setIsVanish] = useState(false);
    const [yesScale, setYesScale] = useState(1);
    const [hasStartedRunning, setHasStartedRunning] = useState(false);

    // Trick logic for Stage 2 ("Are you sure you're sure?")
    const [isTrickActive, setIsTrickActive] = useState(false);
    const [hasTrickDone, setHasTrickDone] = useState(false);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMouseMoving, setIsMouseMoving] = useState(false);
    const mouseMoveTimeout = useRef(null);

    const noBtnRef = useRef(null);
    const [isInteractionBlocked, setIsInteractionBlocked] = useState(false);

    // Block interaction briefly when the question changes
    useEffect(() => {
        setIsInteractionBlocked(true);
        const timer = setTimeout(() => setIsInteractionBlocked(false), 500);
        return () => clearTimeout(timer);
    }, [noCount]);

    // Enter/Exit trick stage
    useEffect(() => {
        if (noCount === 2 && !hasTrickDone) {
            setIsTrickActive(true);
        } else {
            setIsTrickActive(false);
        }
    }, [noCount, hasTrickDone]);

    // Auto-progression logic for the "Endgame" stages
    useEffect(() => {
        if (noCount >= 10 && noCount < 15) {
            const waitTime = noCount === 10 ? 8000 : 5000;
            const timer = setTimeout(() => setNoCount(prev => prev + 1), waitTime);
            return () => clearTimeout(timer);
        }
    }, [noCount]);

    useEffect(() => {
        const handleMove = (e) => {
            // We need to account for the AppScaler's scale when calculating positions
            // But for simple "chase", mousePos.x/y is relative to the viewport.
            // Since the chase button is now absolute inside the stage, we need to convert mousePos.
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            // Convert viewport coordinates to stage coordinates
            // This is a rough approximation but good enough for the chase
            const rect = document.querySelector('.overflow-visible')?.getBoundingClientRect();
            if (rect) {
                const innerX = (clientX - rect.left) / (rect.width / 1300); // 1300 is ideal stage width
                const innerY = (clientY - rect.top) / (rect.height / 920); // 920 is ideal stage height
                setMousePos({ x: innerX, y: innerY });
            } else {
                setMousePos({ x: clientX, y: clientY });
            }

            setIsMouseMoving(true);
            if (mouseMoveTimeout.current) clearTimeout(mouseMoveTimeout.current);
            mouseMoveTimeout.current = setTimeout(() => {
                setIsMouseMoving(false);
            }, 100);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            if (mouseMoveTimeout.current) clearTimeout(mouseMoveTimeout.current);
        };
    }, []);

    useEffect(() => {
        if (noCount >= 3) {
            const growthStage = noCount - 3;
            setYesScale(1 + Math.min(growthStage, 7) * 0.35);
        } else {
            setYesScale(1);
        }
    }, [noCount]);

    const handleNoClick = (e) => {
        if (isInteractionBlocked) return;
        if (e && e.stopPropagation) e.stopPropagation();
        if (noCount === 0) { setNoCount(1); return; }
        if (noCount === 1 || noCount === 2) { setNoCount(0); setHasTrickDone(false); return; }
        handleNoHover();
    };

    const handleNoHover = () => {
        if (isInteractionBlocked) return;
        if (noCount < 3) return;
        if (noCount >= 9) { setIsVanish(true); setNoCount(10); return; }
        if (!hasStartedRunning) setHasStartedRunning(true);

        // Movement is now relative to the STAGE size (1300x920)
        const stageW = 1300;
        const stageH = 920;
        const btnW = 200;
        const btnH = 80;
        const safePadding = 100;

        const targetX = safePadding + Math.random() * (stageW - btnW - safePadding * 2);
        const targetY = safePadding + Math.random() * (stageH - btnH - safePadding * 2);

        // The position state is relative to the button's initial STATIC position
        // For simplicity in the scaled stage, we just move it absolutely within the stage
        const newX = targetX - (stageW / 2 - btnW / 2);
        const newY = targetY - (stageH / 2 + 150);

        setPosition({ x: newX, y: newY });
        setNoCount(prev => prev + 1);
    };

    const handleYesHover = () => {
        if (noCount === 2 && isTrickActive) {
            setIsTrickActive(false);
            setHasTrickDone(true);
        }
    };

    const handleYesClick = (e) => {
        if (isInteractionBlocked) return;
        if (e && e.stopPropagation) e.stopPropagation();
        if (noCount === 1) { setNoCount(2); return; }
        if (noCount === 2) { setNoCount(3); return; }
        onYes();
    };

    const [imageErrors, setImageErrors] = useState({});
    const handleImageError = (key) => setImageErrors(prev => ({ ...prev, [key]: true }));

    const renderImage = (key, label) => {
        if (key === 'heart' && (imageErrors[key] || !IMAGE_ASSETS[key])) return <MailSymbol />;
        if (imageErrors[key]) return <MissingImage label={label} />;
        return (
            <img src={IMAGE_ASSETS[key]} alt={label}
                className="w-[220px] h-[220px] md:w-[280px] md:h-[280px] object-cover border-4 border-black shadow-[8px_8px_0px_0px_#000]"
                onError={() => handleImageError(key)} />
        );
    };

    const getCurrentDisplay = () => {
        if (noCount >= 15) return renderImage('threat', 'Accept Or Else Cat');
        if (noCount === 0) return renderImage('heart', 'Letter');
        if (noCount === 1) return null;
        if (noCount === 2) return renderImage('rusure', 'Are You Sure?');
        const cats = ['why', 'please1', 'please2', 'please3', 'stop', 'dontdothis', 'finalwarning', 'gotu'];
        if (noCount >= 3 && noCount <= 10) return renderImage(cats[noCount - 3], 'Cat');
        return null;
    };

    const getDynamicText = () => {
        const texts = [
            "Will you be my Valentine?", "Are you sure?", "Are you sure you're sure?",
            "why not? Be my valentine!", "what if I said please?", "please??", "PLEASE!!!",
            "Stop!!!! I made this for you!", "Don't do this to me!", "This is your final warning.",
            "haha got you! what are you going to do now?", "seriously.. you'd rather just wait than say yes?",
            "you're not even curious what's inside?", "fine then.. have it your way", "..."
        ];
        return texts[noCount] || "ACCEPT OR DIE !!!";
    };

    const isSwapped = isTrickActive;

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-transparent relative select-none overflow-visible text-black">
            <div className="bg-white border-[6px] md:border-[8px] border-black p-6 md:p-10 shadow-[15px_15px_0px_0px_#000] md:shadow-[25px_25px_0px_0px_#000] max-w-[95vw] md:max-w-4xl w-full text-center flex flex-col items-center justify-start relative overflow-visible min-h-[600px] md:min-h-[700px]">

                <div className="w-full flex flex-col items-center pt-2 md:pt-4">
                    <div className="min-h-[220px] md:min-h-[300px] flex items-center justify-center text-center mb-6 md:mb-10">
                        {getCurrentDisplay() && (
                            <div className="inline-block overflow-visible">
                                {getCurrentDisplay()}
                            </div>
                        )}
                    </div>

                    <div className={`flex items-center justify-center w-full px-2 md:px-4 ${getCurrentDisplay() ? 'pt-6 md:pt-10' : 'pt-0'}`}>
                        <motion.h1
                            key={noCount}
                            className="font-black uppercase leading-[1.1] w-full tracking-tighter transition-all duration-300 text-3xl md:text-5xl lg:text-8xl"
                        >
                            {getDynamicText()}
                        </motion.h1>
                    </div>
                </div>

                <div className="flex-grow w-full" />

                <div className={`flex ${isSwapped ? 'flex-col-reverse md:flex-row-reverse' : 'flex-col md:flex-row'} items-center justify-center gap-6 md:gap-24 relative w-full pt-8 pb-4 md:pb-10 z-[40]`}>
                    <div className="flex items-center justify-center">
                        <AnimatePresence>
                            {!(noCount === 13 || noCount === 14) && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: yesScale }}
                                    onHoverStart={handleYesHover}
                                    onTouchStart={handleYesHover}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleYesClick}
                                    style={{ zIndex: 50 }}
                                    className={`bg-green-500 hover:bg-green-600 text-white font-black py-4 md:py-5 px-10 md:px-16 border-4 md:border-6 border-black text-2xl md:text-3xl active:translate-x-1 active:translate-y-1 relative whitespace-nowrap transition-shadow w-48 md:w-52 ${noCount <= 3 ? 'shadow-[8px_8px_0px_0px_#000] md:shadow-[10px_10px_0px_0px_#000]' : 'shadow-none'}`}
                                >
                                    YES!
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {!isVanish && (
                            <motion.button
                                ref={noBtnRef}
                                onHoverStart={handleNoHover}
                                onTouchStart={handleNoHover}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNoClick}
                                animate={position}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                                style={{ zIndex: 60 }}
                                className={`bg-red-500 hover:bg-red-600 text-white font-black py-4 md:py-5 px-10 md:px-16 border-4 md:border-6 border-black text-2xl md:text-3xl ${noCount <= 3 ? 'shadow-[8px_8px_0px_0px_#000] md:shadow-[10px_10px_0px_0px_#000]' : 'shadow-none'} ${hasStartedRunning ? 'absolute' : 'relative md:static'} z-[60] whitespace-nowrap w-48 md:w-52 pointer-events-auto`}
                            >
                                NO
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {noCount >= 15 && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    onClick={handleYesClick}
                    animate={{ x: mousePos.x, y: mousePos.y, scale: yesScale, opacity: isMouseMoving ? 0.3 : 1 }}
                    style={{ position: 'absolute', left: 0, top: 0, translateX: '-50%', translateY: '-50%', zIndex: 1000 }}
                    transition={{
                        x: { type: "spring", stiffness: 600, damping: 35, mass: 0.2 },
                        y: { type: "spring", stiffness: 600, damping: 35, mass: 0.2 }
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white font-black py-5 px-16 border-6 border-black text-4xl shadow-[10px_10px_0px_0px_#000] whitespace-nowrap"
                >
                    YES!
                </motion.button>
            )}
        </div>
    );
};

export default QuestionScreen;
