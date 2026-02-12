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

    const noBtnRef = useRef(null);

    // Auto-progression logic for the "Endgame" stages
    useEffect(() => {
        if (noCount === 8) {
            const timer = setTimeout(() => setNoCount(9), 5000);
            return () => clearTimeout(timer);
        }
        if (noCount === 9) {
            const timer = setTimeout(() => setNoCount(10), 5000);
            return () => clearTimeout(timer);
        }
    }, [noCount]);

    // Mouse tracking for the "Accept or Else" chase
    useEffect(() => {
        if (noCount >= 10) {
            const handleMouseMove = (e) => {
                setMousePos({ x: e.clientX, y: e.clientY });
            };
            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [noCount]);

    useEffect(() => {
        // 35% growth per interaction
        setYesScale(1 + noCount * 0.35);
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

        const targetAbsX = safePadding + Math.random() * (winW - btnW - safePadding * 2);
        const targetAbsY = safePadding + Math.random() * (winH - btnH - safePadding * 2);

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
        if (noCount >= 10) return renderImage('threat', 'Accept Or Else Cat');
        if (noCount === 0) return renderImage('heart', 'Letter');
        if (noCount < 3) return renderImage('please1', 'Please Cat 1');
        if (noCount < 5) return renderImage('please2', 'Please Cat 2');
        if (noCount < 7) return renderImage('please3', 'Please Cat 3');
        if (noCount < 8) return renderImage('please4', 'Please Cat 4');
        return renderImage('gotu', 'Got U Cat');
    };

    const getDynamicText = () => {
        if (noCount === 0) return "Will you be my Valentine?";
        if (noCount === 1) return "please?";
        if (noCount === 2) return "please??";
        if (noCount >= 3 && noCount < 5) return "PLEASE???";
        if (noCount < 7) return "Don't do this to me!";
        if (noCount === 7) return "This is your final warning.";
        if (noCount === 8) return "haha got you now!";
        if (noCount === 9) return "yeah. what are you going to do?";
        return "ACCEPT OR ELSE.";
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen px-4 bg-transparent relative select-none overflow-hidden text-black">
            <div className="bg-white border-[8px] border-black p-8 shadow-[25px_25px_0px_0px_#000] max-w-4xl max-h-[90vh] w-full text-center flex flex-col items-center justify-between relative overflow-hidden">

                <div className="w-full flex flex-col items-center pointer-events-none">
                    {/* Display Area */}
                    <div className="h-[300px] flex items-center justify-center mb-6">
                        <div className="inline-block overflow-visible">
                            {getCurrentDisplay()}
                        </div>
                    </div>

                    {/* Dynamic Text Area - Increased padding-bottom (pb-12) to stay clear of huge buttons */}
                    <div className="h-[120px] pb-12 flex items-center justify-center relative z-10">
                        <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight w-full tracking-tighter">
                            {getDynamicText()}
                        </h1>
                    </div>
                </div>

                {/* Action Area */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-24 relative w-full h-[250px] pb-6">
                    <div className="flex items-center justify-center">
                        {noCount < 10 ? (
                            <motion.button
                                onClick={handleYesClick}
                                animate={{ scale: yesScale }}
                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                className={`bg-green-500 hover:bg-green-600 text-white font-black py-5 px-16 border-6 border-black text-3xl active:translate-x-1 active:translate-y-1 active:shadow-none z-10 whitespace-nowrap transition-shadow w-52 ${noCount === 0 ? 'shadow-[10px_10px_0px_0px_#000]' : 'shadow-none'}`}
                            >
                                YES!
                            </motion.button>
                        ) : (
                            /* The "ACCEPT OR ELSE" Chase Button */
                            <motion.button
                                onClick={handleYesClick}
                                animate={{
                                    x: mousePos.x - (window.innerWidth / 2),
                                    y: mousePos.y - (window.innerHeight / 2) - 100, // Offset so cursor is over button
                                    scale: yesScale
                                }}
                                transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
                                className="fixed bg-green-500 hover:bg-green-600 text-white font-black py-5 px-16 border-6 border-black text-4xl shadow-[10px_10px_0px_0px_#000] z-[200] whitespace-nowrap w-64 animate-pulse"
                            >
                                YES!
                            </motion.button>
                        )}
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
