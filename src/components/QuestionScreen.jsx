import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800
    });

    const isMobile = windowSize.width < 640;

    // Use a scale factor based on BOTH width and height to ensure content fits the "Safe Zone"
    const contentScale = useMemo(() => {
        const baseWidth = isMobile ? 375 : 1200;
        const baseHeight = isMobile ? 667 : 800;

        const widthRatio = windowSize.width / baseWidth;
        const heightRatio = windowSize.height / baseHeight;

        // Take the more restrictive ratio to ensure we fit in both directions
        const scale = Math.min(widthRatio, heightRatio, 1);
        return isMobile ? Math.max(scale, 0.85) : 1;
    }, [windowSize, isMobile]);

    // Trick logic for Stage 2 ("Are you sure you're sure?")
    const [isTrickActive, setIsTrickActive] = useState(false);
    const [hasTrickDone, setHasTrickDone] = useState(false);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMouseMoving, setIsMouseMoving] = useState(false);
    const mouseMoveTimeout = useRef(null);

    const noBtnRef = useRef(null);
    const [isInteractionBlocked, setIsInteractionBlocked] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            setMousePos({ x: clientX, y: clientY });
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
            // Slightly reduced growth factor for mobile to prevent overlap
            const growthFactor = isMobile ? 0.25 : 0.35;
            setYesScale(1 + Math.min(growthStage, 7) * growthFactor);
        } else {
            setYesScale(1);
        }
    }, [noCount, isMobile]);

    const handleNoClick = (e) => {
        if (isInteractionBlocked) return;
        if (e && e.stopPropagation) e.stopPropagation();

        if (noCount === 0) {
            setNoCount(1);
            return;
        }

        if (noCount === 1 || noCount === 2) {
            setNoCount(0);
            setHasTrickDone(false);
            return;
        }

        handleNoHover();
    };

    const handleNoHover = () => {
        if (isInteractionBlocked) return;
        if (noCount < 3) return;

        if (noCount >= 9) {
            setIsVanish(true);
            setNoCount(10);
            return;
        }

        if (!hasStartedRunning) setHasStartedRunning(true);

        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const btnW = 160;
        const btnH = 60;
        const safePadding = 40;
        const minDistance = winW < 640 ? 150 : 300;

        let targetAbsX, targetAbsY;
        let distance = 0;
        let attempts = 0;

        do {
            targetAbsX = safePadding + Math.random() * (winW - btnW - safePadding * 2);
            targetAbsY = safePadding + Math.random() * (winH - btnH - safePadding * 2);

            // Calculate current absolute position correctly
            const cardCenterW = winW / 2;
            const cardCenterH = winH / 2;
            const currentAbsX = position.x + (cardCenterW - btnW / 2);
            const currentAbsY = position.y + (cardCenterH + 150);

            const dx = targetAbsX - currentAbsX;
            const dy = targetAbsY - currentAbsY;
            distance = Math.sqrt(dx * dx + dy * dy);
            attempts++;
        } while (distance < minDistance && attempts < 20);

        const cardCenterW = winW / 2;
        const cardCenterH = winH / 2;
        const newX = targetAbsX - (cardCenterW - btnW / 2);
        const newY = targetAbsY - (cardCenterH + 150);

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

        if (noCount === 1) {
            setNoCount(2);
            return;
        }
        if (noCount === 2) {
            setNoCount(3);
            return;
        }

        onYes();
    };

    const [imageErrors, setImageErrors] = useState({});
    const handleImageError = (key) => setImageErrors(prev => ({ ...prev, [key]: true }));

    const renderImage = (key, label) => {
        if (key === 'heart' && (imageErrors[key] || !IMAGE_ASSETS[key])) return <MailSymbol />;
        if (imageErrors[key]) return <MissingImage label={label} />;
        return (
            <img src={IMAGE_ASSETS[key]} alt={label}
                className="w-[180px] h-[180px] md:w-[280px] md:h-[280px] object-cover border-4 border-black shadow-[8px_8px_0px_0px_#000]"
                onError={() => handleImageError(key)} />
        );
    };

    const getCurrentDisplay = () => {
        if (noCount >= 15) return renderImage('threat', 'Accept Or Else Cat');
        if (noCount === 0) return renderImage('heart', 'Letter');
        if (noCount === 1) return null;
        if (noCount === 2) return renderImage('rusure', 'Are You Sure?');
        if (noCount === 3) return renderImage('why', 'Why Not Cat');
        if (noCount === 4) return renderImage('please1', 'Please Cat 1');
        if (noCount === 5) return renderImage('please2', 'Please Cat 2');
        if (noCount === 6) return renderImage('please3', 'Please Cat 3');
        if (noCount === 7) return renderImage('stop', 'Stop Cat');
        if (noCount === 8) return renderImage('dontdothis', 'Don\'t Do This Cat');
        if (noCount === 9) return renderImage('finalwarning', 'Final Warning Cat');
        if (noCount === 10) return renderImage('gotu', 'Got U Cat');
        return null;
    };

    const getDynamicText = () => {
        if (noCount === 0) return "Will you be my Valentine?";
        if (noCount === 1) return "Are you sure?";
        if (noCount === 2) return "Are you sure you're sure?";
        if (noCount === 3) return "why not? Be my valentine!";
        if (noCount === 4) return "what if I said please?";
        if (noCount === 5) return "please??";
        if (noCount === 6) return "PLEASE!!!";
        if (noCount === 7) return "Stop!!!! I made this for you!";
        if (noCount === 8) return "Don't do this to me!";
        if (noCount === 9) return "This is your final warning.";
        if (noCount === 10) return "haha got you! what are you going to do now?";
        if (noCount === 11) return "seriously.. you'd rather just wait than say yes?";
        if (noCount === 12) return "you're not even curious what's inside?";
        if (noCount === 13) return "fine then.. have it your way";
        if (noCount === 14) return "...";
        return "ACCEPT OR DIE !!!";
    };

    const dynamicFontSize = () => {
        const text = getDynamicText();
        const baseSize = isMobile ? 1.8 : 3.5;
        const length = text.length;
        if (length <= 20) return `${baseSize * contentScale}rem`;
        const scaledSize = (baseSize * 22) / length;
        return `${Math.max(isMobile ? 1.2 : 1.5, Math.min(baseSize, scaledSize)) * contentScale}rem`;
    };

    const isSwapped = isTrickActive;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen px-4 bg-transparent relative select-none overflow-hidden text-black transition-all duration-300" style={{ transform: `scale(${isMobile ? 1 : contentScale})` }}>
            <div className="bg-white border-[6px] md:border-[8px] border-black p-6 md:p-8 shadow-[15px_15px_0px_0px_#000] md:shadow-[25px_25px_0px_0px_#000] max-w-[95vw] md:max-w-4xl min-h-[500px] md:min-h-[auto] max-h-[92vh] w-full text-center flex flex-col items-center justify-between relative overflow-hidden">

                {/* Content Section: Always takes available space but pushes buttons down */}
                <div className="w-full flex flex-col items-center pointer-events-none flex-grow justify-start pt-2">
                    {/* Image Area: Controlled height to ensure room for text/buttons */}
                    <div className="h-[200px] md:h-[300px] flex items-center justify-center mb-4 md:mb-6 text-center px-4 md:px-10">
                        {getCurrentDisplay() && (
                            <div className="inline-block overflow-visible scale-90 md:scale-100">
                                {getCurrentDisplay()}
                            </div>
                        )}
                    </div>

                    {/* Text Area: Flexible but separated */}
                    <div className="min-h-[80px] md:min-h-[120px] flex items-center justify-center text-center relative z-10 w-full px-2 md:px-4 mb-4">
                        <motion.h1
                            key={noCount}
                            initial={false}
                            animate={{ y: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{ fontSize: dynamicFontSize() }}
                            className="font-black uppercase leading-[1.1] w-full tracking-tighter transition-all duration-300 whitespace-normal"
                        >
                            {getDynamicText()}
                        </motion.h1>
                    </div>
                </div>

                {/* Button Section: Fixed-ish area with clear separation */}
                <div className={`flex ${isSwapped ? 'flex-col-reverse md:flex-row-reverse' : 'flex-col md:flex-row'} items-center justify-center gap-4 md:gap-24 relative w-full pt-4 pb-4 md:pb-6 min-h-[180px] md:min-h-[200px]`}>
                    <div className="flex items-center justify-center">
                        <AnimatePresence>
                            {!(noCount === 13 || noCount === 14) && (
                                <>
                                    {noCount < 15 ? (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: yesScale }}
                                            onHoverStart={handleYesHover}
                                            onTouchStart={handleYesHover}
                                            whileTap={{ scale: 0.9, x: 2, y: 2 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            onClick={handleYesClick}
                                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                            className={`bg-green-500 hover:bg-green-600 text-white font-black py-4 md:py-5 px-10 md:px-16 border-4 md:border-6 border-black text-xl md:text-3xl active:translate-x-1 active:translate-y-1 z-10 whitespace-nowrap transition-shadow w-44 md:w-52 ${noCount <= 3 ? 'shadow-[8px_8px_0px_0px_#000] md:shadow-[10px_10px_0px_0px_#000]' : 'shadow-none'}`}
                                        >
                                            YES!
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            onClick={handleYesClick}
                                            animate={{
                                                x: mousePos.x,
                                                y: mousePos.y,
                                                scale: yesScale,
                                                opacity: isMouseMoving ? 0.3 : 1
                                            }}
                                            style={{
                                                left: 0,
                                                top: 0,
                                                translateX: '-50%',
                                                translateY: '-50%'
                                            }}
                                            transition={{
                                                x: { type: "spring", stiffness: 600, damping: 35, mass: 0.2 },
                                                y: { type: "spring", stiffness: 600, damping: 35, mass: 0.2 },
                                                opacity: { duration: 0.4, ease: "easeInOut" }
                                            }}
                                            className="fixed bg-green-500 hover:bg-green-600 text-white font-black py-4 md:py-5 px-10 md:px-16 border-4 md:border-6 border-black text-3xl md:text-4xl shadow-[8px_8px_0px_0px_#000] md:shadow-[10px_10px_0px_0px_#000] z-[200] whitespace-nowrap w-52 md:w-64"
                                        >
                                            YES!
                                        </motion.button>
                                    )}
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {!isVanish && (
                            <motion.button
                                ref={noBtnRef}
                                onHoverStart={handleNoHover}
                                onTouchStart={handleNoHover}
                                whileTap={{ scale: 0.9, x: 2, y: 2 }}
                                onClick={handleNoClick}
                                animate={position}
                                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                                className={`bg-red-500 hover:bg-red-600 text-white font-black py-4 md:py-5 px-10 md:px-16 border-4 md:border-6 border-black text-xl md:text-3xl ${noCount <= 3 ? 'shadow-[8px_8px_0px_0px_#000] md:shadow-[10px_10px_0px_0px_#000]' : 'shadow-none'} ${hasStartedRunning ? 'fixed z-[100]' : 'relative md:static z-[60]'} whitespace-nowrap w-44 md:w-52 pointer-events-auto`}
                            >
                                NO
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default QuestionScreen;
