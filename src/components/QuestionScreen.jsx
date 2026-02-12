import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { AlertCircle } from 'lucide-react';
import MailSymbol from './MailSymbol';

const MissingImage = ({ label }) => (
    <div className="w-[280px] h-[280px] bg-gray-200 border-4 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-500 font-black uppercase text-sm p-4 text-center italic">
        <AlertCircle size={32} className="mb-2" />
        <span>Missing {label}</span>
        <span className="text-[10px] mt-2 normal-case font-normal">(Drop in /public/images/)</span>
    </div>
);

const QuestionScreen = ({ onYes }) => {
    const [noCount, setNoCount] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [showThreat, setShowThreat] = useState(false);
    const [isVanish, setIsVanish] = useState(false);
    const [yesScale, setYesScale] = useState(1);
    const [hasStartedRunning, setHasStartedRunning] = useState(false);

    const noBtnRef = useRef(null);

    useEffect(() => {
        setYesScale(1 + noCount * 0.35);
        if (noCount === 8) setIsVanish(true);
        if (noCount >= 10) setTimeout(() => setShowThreat(true), 300);
    }, [noCount]);

    const handleNoInteraction = () => {
        if (noCount >= 8) {
            setIsVanish(true);
            return;
        }

        if (!hasStartedRunning) setHasStartedRunning(true);

        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const btnW = 200; // Updated to match button width
        const btnH = 80;
        const padding = 20;
        const cardCenterW = winW / 2;
        const cardCenterH = winH / 2;

        const targetAbsX = padding + Math.random() * (winW - btnW - padding * 2);
        const targetAbsY = padding + Math.random() * (winH - btnH - padding * 2);

        const newX = targetAbsX - (cardCenterW - btnW / 2);
        const newY = targetAbsY - (cardCenterH + 100);

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
                className="w-[280px] h-[280px] object-cover border-4 border-black"
                onError={() => handleImageError(key)} />
        );
    };

    const getCurrentDisplay = () => {
        if (showThreat) return renderImage('threat', 'Accept Or Else Cat');
        if (noCount === 0) return renderImage('heart', 'Letter');
        if (noCount < 3) return renderImage('please1', 'Please Cat 1');
        if (noCount < 5) return renderImage('please2', 'Please Cat 2');
        if (noCount < 7) return renderImage('please3', 'Please Cat 3');
        if (noCount < 8) return renderImage('please4', 'Please Cat 4');
        return renderImage('gotu', 'Got U Cat');
    };

    if (showThreat) {
        return (
            <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-4 select-none overflow-hidden text-black">
                <div className="border-[6px] border-black p-4 bg-white shadow-[15px_15px_0px_0px_#000] max-w-lg w-full flex flex-col items-center">
                    <div className="border-4 border-black mb-4 overflow-hidden">
                        {renderImage('threat', 'Accept Or Else Cat')}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-center mt-2 uppercase italic leading-none drop-shadow-sm">ACCEPT. OR ELSE.</h2>
                    <motion.button
                        onClick={handleYesClick}
                        whileTap={{ scale: 0.9 }}
                        className="mt-8 mb-4 bg-green-500 hover:bg-green-600 text-white font-black py-6 px-16 border-6 border-black text-4xl animate-pulse"
                    >
                        YES!
                    </motion.button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen px-4 bg-transparent relative select-none overflow-hidden text-black">
            <div className="bg-white border-[8px] border-black p-6 shadow-[20px_20px_0px_0px_#000] max-w-3xl w-full text-center flex flex-col items-center relative">
                <div className="w-full flex flex-col items-center pointer-events-none">
                    <div className="inline-block overflow-visible">
                        {getCurrentDisplay()}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black mb-4 -mt-2 uppercase leading-tight w-full tracking-tighter">
                        Will you be my Valentine?
                    </h1>
                    <div className="w-full h-1.5 bg-black mb-8" />
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-24 relative w-full h-[180px] pb-4">
                    <div className="flex items-center justify-center">
                        <motion.button
                            onClick={handleYesClick}
                            animate={{ scale: yesScale }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            className={`bg-green-500 hover:bg-green-600 text-white font-black py-4 px-12 border-4 border-black text-3xl active:translate-x-1 active:translate-y-1 active:shadow-none z-50 whitespace-nowrap transition-shadow w-48 ${noCount === 0 ? 'shadow-[8px_8px_0px_0px_#000]' : 'shadow-none'}`}
                        >
                            YES!
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {!isVanish && (
                            <motion.button
                                ref={noBtnRef}
                                onHoverStart={handleNoInteraction}
                                onMouseDown={handleNoInteraction}
                                animate={position}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                                className={`bg-red-500 hover:bg-red-600 text-white font-black py-4 px-12 border-4 border-black text-3xl shadow-[8px_8px_0px_0px_#000] ${hasStartedRunning ? 'absolute' : 'relative md:static'} z-40 whitespace-nowrap w-48`}
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
