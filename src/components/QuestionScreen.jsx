import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import MailSymbol from './MailSymbol';
import { IMAGE_ASSETS } from '../config/assets';
import { DASHBOARD_CONTENT } from '../config/content';

const MissingImage = ({ label }) => (
    <div className="w-[180px] h-[180px] md:w-[300px] md:h-[300px] bg-gray-200 border-4 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-500 font-black uppercase text-xs md:text-sm p-4 text-center italic">
        <AlertCircle size={32} className="mb-2" />
        <span>Missing {label}</span>
        <span className="text-[10px] mt-2 normal-case font-normal">(Drop in /public/images/)</span>
    </div>
);

const QuestionScreen = ({ onYes }) => {
    const [noCount, setNoCount] = useState(0);
    const [percPosition, setPercPosition] = useState(null);
    const [isVanish, setIsVanish] = useState(false);
    const [yesScale, setYesScale] = useState(1);
    const [hasStartedRunning, setHasStartedRunning] = useState(false);
    const [isInteractionBlocked, setIsInteractionBlocked] = useState(false);
    const [isTrickActive, setIsTrickActive] = useState(false);

    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const [isMouseMoving, setIsMouseMoving] = useState(false);
    const mouseMoveTimeout = useRef(null);

    const noBtnRef = useRef(null);
    const rootRef = useRef(null);
    const isHoveringNo = useRef(false);
    const isProcessingJump = useRef(false);

    const PROTECTION_DELAY = 350; // Requested balance between 500ms and 250ms

    // Physical mouse check with a safe buffer
    const isMouseOverNoButton = () => {
        if (!percPosition) return false;
        const dx = Math.abs(mousePos.x - percPosition.x);
        const dy = Math.abs(mousePos.y - percPosition.y);
        // Using a generous hit-box to ensure we catch the mouse for the auto-flee
        return dx < 9 && dy < 5;
    };

    // Main Interaction Blocker: Syncs with noCount updates
    useEffect(() => {
        setIsInteractionBlocked(true);
        const timer = setTimeout(() => {
            setIsInteractionBlocked(false);

            // AUTO-FLEE: Only trigger if the mouse is STILL there after the lockdown ends
            // This is the "check states before and after protection lock" logic
            if ((isHoveringNo.current || isMouseOverNoButton()) && noCount >= 3 && noCount < 10) {
                // We strictly call a specialized flea that resets state
                executeFlee();
            }
        }, PROTECTION_DELAY);
        return () => clearTimeout(timer);
    }, [noCount]);

    useEffect(() => {
        setIsTrickActive(noCount === 2);
    }, [noCount]);

    useEffect(() => {
        const handleMove = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const rect = rootRef.current?.getBoundingClientRect();
            if (rect) {
                const px = ((clientX - rect.left) / rect.width) * 100;
                const py = ((clientY - rect.top) / rect.height) * 100;
                setMousePos({ x: px, y: py });
            }
            setIsMouseMoving(true);
            if (mouseMoveTimeout.current) clearTimeout(mouseMoveTimeout.current);
            mouseMoveTimeout.current = setTimeout(() => setIsMouseMoving(false), 100);
        };
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
        };
    }, []);

    useEffect(() => {
        if (noCount >= 10 && noCount < 15) {
            const waitTime = noCount === 10 ? 8000 : 5000;
            const timer = setTimeout(() => setNoCount(prev => prev + 1), waitTime);
            return () => clearTimeout(timer);
        }
    }, [noCount]);

    useEffect(() => {
        const isMobile = window.innerWidth < 1024;
        const effectiveGrowthCount = Math.min(noCount, 10);
        if (effectiveGrowthCount >= 3) {
            // RELATIVE MOBILE GROWTH: 0.22 vs 0.45 
            const multiplier = isMobile ? 0.22 : 0.45;
            const stage = effectiveGrowthCount - 3;
            setYesScale(1 + stage * multiplier);
        } else {
            setYesScale(1);
        }
    }, [noCount]);

    const executeFlee = () => {
        if (isProcessingJump.current || noCount >= 10) return;

        // VANISH CHECK: Trigger the transition to the endgame silence
        if (noCount >= 9) {
            setIsVanish(true);
            setNoCount(10);
            return;
        }

        isProcessingJump.current = true;

        // Reset hover states immediately before moving
        isHoveringNo.current = false;

        const safePad = 12;
        const minJump = 25;
        let targetX, targetY, dist;
        let attempts = 0;

        const currX = percPosition ? percPosition.x : 50;
        const currY = percPosition ? percPosition.y : 80;

        do {
            targetX = safePad + Math.random() * (100 - safePad * 2);
            targetY = safePad + Math.random() * (100 - safePad * 2);
            const dx = targetX - currX;
            const dy = targetY - currY;
            dist = Math.sqrt(dx * dx + dy * dy);
            attempts++;
        } while (dist < minJump && attempts < 50);

        if (!hasStartedRunning) {
            const rect = noBtnRef.current?.getBoundingClientRect();
            const containerRect = rootRef.current?.getBoundingClientRect();
            if (rect && containerRect) {
                const initialPercX = ((rect.left + rect.width / 2 - containerRect.left) / containerRect.width) * 100;
                const initialPercY = ((rect.top + rect.height / 2 - containerRect.top) / containerRect.height) * 100;

                setPercPosition({ x: initialPercX, y: initialPercY });
                setHasStartedRunning(true);

                // Docking delay – captures state for one frame, then jumps
                setTimeout(() => {
                    setPercPosition({ x: targetX, y: targetY });
                    setNoCount(prev => prev + 1);
                    isProcessingJump.current = false;
                }, 60);
            } else {
                isProcessingJump.current = false;
            }
        } else {
            setPercPosition({ x: targetX, y: targetY });
            setNoCount(prev => prev + 1);
            // Lock until state updates propagate
            setTimeout(() => { isProcessingJump.current = false; }, 50);
        }
    };

    const handleNoHover = () => {
        if (isInteractionBlocked || isProcessingJump.current) return;
        if (noCount < 3) return;
        executeFlee();
    };

    const handleNoClick = (e) => {
        if (isInteractionBlocked || isProcessingJump.current) return;
        if (e && e.stopPropagation) e.stopPropagation();
        if (noCount === 0) { setNoCount(1); return; }
        if (noCount === 1 || noCount === 2) { setNoCount(0); return; }
        executeFlee();
    };

    const [imageErrors, setImageErrors] = useState({});
    const handleImageError = (key) => setImageErrors(prev => ({ ...prev, [key]: true }));

    const renderImage = (key, label) => {
        const cls = "w-[200px] h-[200px] md:w-[280px] md:h-[280px] object-cover border-4 border-black shadow-[8px_8px_0px_0px_#000]";

        // Handle Heart/Initial Image specially
        if (key === 'heart') {
            if (DASHBOARD_CONTENT.initialImage) {
                return <img src={DASHBOARD_CONTENT.initialImage} alt={label} className={cls} onError={() => handleImageError(key)} />;
            }
            if (IMAGE_ASSETS[key]) {
                return <img src={IMAGE_ASSETS[key]} alt={label} className={cls} onError={() => handleImageError(key)} />;
            }
            return <MailSymbol />;
        }

        if (imageErrors[key]) return <MissingImage label={label} />;
        return <img src={IMAGE_ASSETS[key]} alt={label} className={cls} onError={() => handleImageError(key)} />;
    };

    const getCurrentDisplay = () => {
        if (noCount >= 15) return renderImage('threat', 'CAT');
        if (noCount === 0 || noCount === 1) return renderImage('heart', 'Letter');
        if (noCount === 2) return renderImage('rusure', 'Sure?');
        const cats = ['why', 'please1', 'please2', 'please3', 'stop', 'dontdothis', 'finalwarning', 'gotu'];
        const idx = Math.floor(noCount) - 3;
        if (idx >= 0 && idx < cats.length) return renderImage(cats[idx], 'Cat');
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
        return texts[Math.floor(noCount)] || "ACCEPT OR DIE !!!";
    };

    return (
        <div ref={rootRef} className="h-full w-full flex items-center justify-center relative overflow-visible select-none text-black">
            {/* Running NO button */}
            {hasStartedRunning && !isVanish && (
                <motion.button
                    key="btn-no-running"
                    onHoverStart={() => { isHoveringNo.current = true; handleNoHover(); }}
                    onHoverEnd={() => { isHoveringNo.current = false; }}
                    onTouchStart={() => { isHoveringNo.current = true; handleNoHover(); }}
                    onTouchEnd={() => { isHoveringNo.current = false; }}
                    onClick={handleNoClick}
                    initial={false}
                    animate={{ left: `${percPosition?.x || 50}%`, top: `${percPosition?.y || 80}%` }}
                    style={{
                        position: 'absolute',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 200
                    }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    className="bg-red-500 hover:bg-red-600 text-white font-black py-4 md:py-5 px-10 md:px-16 border-4 md:border-6 border-black text-2xl md:text-3xl active:translate-x-1 active:translate-y-1 shadow-[8px_8px_0px_0px_#000] md:shadow-[10px_10px_0px_0px_#000] whitespace-nowrap w-48 md:w-52"
                >
                    NO
                </motion.button>
            )}

            {/* CARD */}
            <div className="bg-white border-[6px] md:border-[8px] border-black p-6 md:p-10 shadow-[20px_20px_0px_0px_#000] md:shadow-[30px_30px_0px_0px_#000] max-w-[95vw] md:max-w-4xl w-full text-center flex flex-col items-center justify-start relative overflow-visible min-h-[600px] md:min-h-[700px]">

                {noCount >= 15 && (
                    <div className="absolute inset-x-0 inset-y-0 z-[500] bg-white flex flex-col items-center justify-center p-6 md:p-10">
                        <div className="text-center z-10 mb-20 px-8">
                            <div className="mb-10 scale-125 md:scale-150 flex justify-center">{renderImage('threat', 'CAT')}</div>
                            <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter text-black">
                                {getDynamicText()}
                            </h1>
                        </div>
                        <motion.button
                            onClick={() => onYes()}
                            animate={{ left: `${mousePos.x}%`, top: `${mousePos.y}%`, scale: yesScale, opacity: isMouseMoving ? 0.3 : 1 }}
                            style={{ position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 1000 }}
                            className="bg-green-500 hover:bg-green-600 text-white font-black py-6 px-20 border-6 border-black text-5xl shadow-[10px_10px_0px_0px_#000] active:translate-x-1 active:translate-y-1"
                        >
                            YES!
                        </motion.button>
                    </div>
                )}

                {noCount < 15 && (
                    <div className="w-full flex flex-col items-center pt-2 md:pt-4">
                        <div className="min-h-[220px] md:min-h-[300px] flex items-center justify-center mb-6 md:mb-10">
                            {getCurrentDisplay()}
                        </div>
                        <div className={`px-2 md:px-4 ${getCurrentDisplay() ? 'pt-6 md:pt-10' : 'pt-0'}`}>
                            <motion.h1 key={noCount} className="font-black uppercase leading-[1.1] w-full tracking-tighter text-3xl md:text-5xl lg:text-7xl">
                                {getDynamicText()}
                            </motion.h1>
                        </div>
                    </div>
                )}

                {noCount < 15 && <div className="flex-grow w-full" />}

                {noCount < 15 && (
                    <div className={`flex ${isTrickActive ? 'flex-col-reverse md:flex-row-reverse' : 'flex-col md:flex-row'} items-center justify-center gap-6 md:gap-24 relative w-full pt-8 pb-4 md:pb-10`}>
                        <motion.button
                            animate={{ opacity: 1, scale: yesScale }}
                            onHoverStart={() => { if (noCount === 2) setIsTrickActive(false); }}
                            onTouchStart={() => { if (noCount === 2) setIsTrickActive(false); }}
                            onClick={(e) => {
                                if (isInteractionBlocked) return;
                                e.stopPropagation();
                                if (noCount === 1) { setNoCount(2); return; }
                                if (noCount === 2) { setNoCount(3); return; }
                                onYes();
                            }}
                            className={`bg-green-500 hover:bg-green-600 text-white font-black py-4 md:py-5 px-10 md:px-16 border-4 md:border-6 border-black text-2xl md:text-3xl relative z-10 w-48 md:w-52 transition-shadow ${yesScale <= 1 ? 'shadow-[8px_8px_0px_0px_#000] md:shadow-[10px_10px_0px_0px_#000] active:translate-x-1 active:translate-y-1' : ''}`}
                        >
                            YES!
                        </motion.button>

                        {!hasStartedRunning && !isVanish && (
                            <motion.button
                                ref={noBtnRef}
                                onHoverStart={() => { isHoveringNo.current = true; handleNoHover(); }}
                                onHoverEnd={() => { isHoveringNo.current = false; }}
                                onTouchStart={() => { isHoveringNo.current = true; handleNoHover(); }}
                                onTouchEnd={() => { isHoveringNo.current = false; }}
                                onClick={handleNoClick}
                                className="bg-red-500 hover:bg-red-600 text-white font-black py-4 md:py-5 px-10 md:px-16 border-4 md:border-6 border-black text-2xl md:text-3xl relative z-10 shadow-[8px_8px_0px_0px_#000] md:shadow-[10px_10px_0px_0px_#000] active:translate-x-1 active:translate-y-1 w-48 md:w-52"
                            >
                                NO
                            </motion.button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionScreen;
