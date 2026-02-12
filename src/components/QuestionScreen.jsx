import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { AlertCircle } from 'lucide-react';
import MailSymbol from './MailSymbol';

const MissingImage = ({ label }) => (
    <div className="w-[300px] h-[300px] bg-gray-200 border-4 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-500 font-black uppercase text-sm p-4 text-center italic">
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
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMouseMoving, setIsMouseMoving] = useState(false);
    const mouseMoveTimeout = useRef(null);

    const noBtnRef = useRef(null);

    // Auto-progression logic for the "Endgame" stages
    useEffect(() => {
        // Auto-progression for stages 8-12 (silence sequence)
        if (noCount >= 8 && noCount < 13) {
            // Make the first waiting stage (8) longer for dramatic effect
            const waitTime = noCount === 8 ? 8000 : 5000;
            const timer = setTimeout(() => setNoCount(prev => prev + 1), waitTime);
            return () => clearTimeout(timer);
        }
    }, [noCount]);

    // Mouse tracking for the "Accept or Else" chase and movement detection
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            setIsMouseMoving(true);

            if (mouseMoveTimeout.current) clearTimeout(mouseMoveTimeout.current);
            mouseMoveTimeout.current = setTimeout(() => {
                setIsMouseMoving(false);
            }, 100);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (mouseMoveTimeout.current) clearTimeout(mouseMoveTimeout.current);
        };
    }, []);

    useEffect(() => {
        // 35% growth per interaction, capped at stage 7
        setYesScale(1 + Math.min(noCount, 7) * 0.35);
    }, [noCount]);

    const handleNoInteraction = () => {
        // The 8th hit (noCount=7) makes it vanish
        if (noCount >= 7) {
            setIsVanish(true);
            setNoCount(8);
            return;
        }

        if (!hasStartedRunning) setHasStartedRunning(true);

        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const btnW = 200;
        const btnH = 80;
        const safePadding = 50;
        const minDistance = 300; // Minimum jump distance in pixels

        let targetAbsX, targetAbsY;
        let distance = 0;
        let attempts = 0;

        // Ensure the new spot is at least minDistance away from the current position
        do {
            targetAbsX = safePadding + Math.random() * (winW - btnW - safePadding * 2);
            targetAbsY = safePadding + Math.random() * (winH - btnH - safePadding * 2);

            // Calculate current absolute position to compare distance
            // We use the same coordinate system logic as setting newX/newY
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

    const handleYesClick = () => {
        confetti({ particleCount: 250, spread: 120, origin: { y: 0.6 } });
        onYes();
    };

    const imageAssets = {
        heart: "/images/heart.png",
        please1: "/images/please1.png",
        please2: "/images/please2.png",
        please3: "/images/please3.png",
        please4: "/images/please4.png",
        gotu: "/images/got_u.png",
        threat: "/images/threat.png"
    };

    const [imageErrors, setImageErrors] = useState({});
    const handleImageError = (key) => setImageErrors(prev => ({ ...prev, [key]: true }));

    const renderImage = (key, label) => {
        if (key === 'heart' && (imageErrors[key] || !imageAssets[key])) return <MailSymbol />;
        if (imageErrors[key]) return <MissingImage label={label} />;
        return (
            <img src={imageAssets[key]} alt={label}
                className="w-[280px] h-[280px] object-cover border-4 border-black shadow-[8px_8px_0px_0px_#000]"
                onError={() => handleImageError(key)} />
        );
    };

    const getCurrentDisplay = () => {
        if (noCount >= 13) return renderImage('threat', 'Accept Or Else Cat');
        if (noCount === 0) return renderImage('heart', 'Letter');
        if (noCount < 3) return renderImage('please1', 'Please Cat 1');
        if (noCount < 5) return renderImage('please2', 'Please Cat 2');
        if (noCount < 7) return renderImage('please3', 'Please Cat 3');
        if (noCount < 8) return renderImage('please4', 'Please Cat 4');
        if (noCount === 8) return renderImage('gotu', 'Got U Cat');
        // For stages 9-12 (Waiting/Silence) - No picture
        return null;
    };

    const getDynamicText = () => {
        if (noCount === 0) return "Will you be my Valentine?";
        if (noCount === 1) return "why not?";
        if (noCount === 2) return "what if I said please?";
        if (noCount === 3) return "please??";
        if (noCount === 4) return "PLEASE!!!";
        if (noCount === 5) return "Stop!!!! I made this for you!";
        if (noCount === 6) return "Don't do this to me!";
        if (noCount === 7) return "This is your final warning.";
        if (noCount === 8) return "haha got you! what are you going to do now?";
        if (noCount === 9) return "seriously.. you'd rather just wait than say yes?";
        if (noCount === 10) return "you're not even curious what's inside?";
        if (noCount === 11) return "fine then.. have it your way";
        if (noCount === 12) return "...";
        return "ACCEPT OR DIE !!!";
    };

    // Calculate dynamic font size based on text length to fit in one line
    const dynamicFontSize = () => {
        const text = getDynamicText();
        const baseSize = 3.5; // Lowered from 4.5 to be safer
        const length = text.length;
        // Aim for ~22 characters at base size
        if (length <= 20) return `${baseSize}rem`;
        const scaledSize = (baseSize * 22) / length;
        return `${Math.max(1.5, Math.min(baseSize, scaledSize))}rem`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen px-4 bg-transparent relative select-none overflow-hidden text-black">
            <div className="bg-white border-[8px] border-black p-8 shadow-[25px_25px_0px_0px_#000] max-w-4xl max-h-[90vh] w-full text-center flex flex-col items-center justify-between relative overflow-hidden">

                <div className="w-full flex flex-col items-center pointer-events-none min-h-[420px]">
                    {/* Display Area - Shows the Image if it exists */}
                    <div className="h-[300px] flex items-center justify-center mb-0 text-center px-10">
                        {getCurrentDisplay() && (
                            <div className="inline-block overflow-visible">
                                {getCurrentDisplay()}
                            </div>
                        )}
                    </div>

                    {/* Dynamic Text Area - Unified animated text */}
                    {/* Shifted y when no image is showing to occupy the space naturally */}
                    <div className="h-[120px] flex items-start justify-center relative z-10 w-full px-4 pt-4">
                        <motion.h1
                            key={noCount}
                            initial={false}
                            animate={{
                                y: getCurrentDisplay() ? 0 : -160,
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{
                                fontSize: dynamicFontSize(),
                            }}
                            className={`font-black uppercase leading-tight w-full tracking-tighter transition-all duration-300 ${!getCurrentDisplay() ? 'whitespace-normal' : 'whitespace-nowrap'}`}
                        >
                            {getDynamicText()}
                        </motion.h1>
                    </div>
                </div>
                {/* Action Area */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-24 relative w-full h-[250px] pb-6">
                    <div className="flex items-center justify-center">
                        <AnimatePresence>
                            {/* Button stays hidden during 'fine then..' (11) and '...' (12) */}
                            {!(noCount === 11 || noCount === 12) && (
                                <>
                                    {noCount < 13 ? (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: yesScale }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            onClick={handleYesClick}
                                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                            className={`bg-green-500 hover:bg-green-600 text-white font-black py-5 px-16 border-6 border-black text-3xl active:translate-x-1 active:translate-y-1 active:shadow-none z-10 whitespace-nowrap transition-shadow w-52 ${noCount === 0 ? 'shadow-[10px_10px_0px_0px_#000]' : 'shadow-none'}`}
                                        >
                                            YES!
                                        </motion.button>
                                    ) : (
                                        /* The "ACCEPT OR DIE !!!" Chase Button - Only triggered at Stage 13+ */
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
                                            className="fixed bg-green-500 hover:bg-green-600 text-white font-black py-5 px-16 border-6 border-black text-4xl shadow-[10px_10px_0px_0px_#000] z-[200] whitespace-nowrap w-64"
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
                                onHoverStart={handleNoInteraction}
                                onMouseDown={handleNoInteraction}
                                animate={position}
                                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                                className={`bg-red-500 hover:bg-red-600 text-white font-black py-5 px-16 border-6 border-black text-3xl shadow-[10px_10px_0px_0px_#000] ${hasStartedRunning ? 'fixed z-[100]' : 'relative md:static z-[60]'} whitespace-nowrap w-52 pointer-events-auto`}
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
