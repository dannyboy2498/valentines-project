import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Heart, Key, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const LockScreen = ({ onUnlock }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [showUnlockedIcon, setShowUnlockedIcon] = useState(false);
    const CORRECT_CODE = 'ROSES'; // The answer to the riddle

    const handleSubmit = (e) => {
        e.preventDefault();
        if (code.toUpperCase() === CORRECT_CODE) {
            triggerUnlockSequence();
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
            setCode('');
        }
    };

    const triggerUnlockSequence = () => {
        setIsUnlocking(true);

        // Stage 1: Key flight (starts immediately)
        // Stage 2: Lock turns to Unlock (after key lands, ~1.2s)
        setTimeout(() => {
            // Play success sound IMMEDIATELY as icon changes
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => { });

            setShowUnlockedIcon(true);
        }, 1200);

        // Stage 3: Proceed to Question Screen (total delay ~2.5s)
        setTimeout(() => {
            onUnlock();
        }, 2800);
    };

    const handleInputChange = (e) => {
        setError(false);
        setCode(e.target.value.toUpperCase());
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen px-4 bg-transparent relative select-none overflow-visible text-black">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{
                    y: 0,
                    opacity: 1,
                    scale: isUnlocking ? [1, 1.02, 1] : 1,
                    filter: isUnlocking ? 'brightness(1.05)' : 'brightness(1)'
                }}
                className="bg-white border-[8px] border-black p-10 shadow-[25px_25px_0px_0px_#000] max-w-md w-full text-center flex flex-col items-center relative"
            >
                {/* Decorative Badge */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-black py-2 px-8 border-[6px] border-black shadow-[8px_8px_0px_0px_#000] transform rotate-3 z-10">
                    <span className="text-xl italic uppercase">Almost there</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-black mb-8 mt-4 uppercase leading-tight tracking-tighter">
                    Enter Your Code
                </h1>

                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                    {/* CODE INPUT */}
                    <div className="relative w-full mb-8">
                        <input
                            disabled={isUnlocking}
                            type="text"
                            value={code}
                            onChange={handleInputChange}
                            placeholder="?????"
                            maxLength={5}
                            className={`w-full bg-gray-50 border-[6px] border-black p-4 text-center text-4xl font-black uppercase tracking-[0.2em] shadow-[8px_8px_0px_0px_#000] outline-none transition-all ${error ? 'border-red-500 text-red-500 animate-shake' : 'focus:bg-white focus:shadow-[12px_12px_0px_0px_#000]'} ${isUnlocking ? 'opacity-50' : 'opacity-100'}`}
                        />

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute -bottom-10 left-0 right-0 flex items-center justify-center gap-2 text-red-600 font-black uppercase italic"
                                >
                                    <AlertCircle size={18} />
                                    <span>Invalid Secret Code</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* UNLOCK BUTTON */}
                    <motion.button
                        disabled={isUnlocking}
                        whileHover={isUnlocking ? {} : { scale: 1.05 }}
                        whileTap={isUnlocking ? {} : { scale: 0.95 }}
                        type="submit"
                        className={`w-full ${isUnlocking ? 'bg-green-500' : 'bg-yellow-400 hover:bg-yellow-500'} text-white font-black py-4 border-[6px] border-black text-2xl shadow-[10px_10px_0px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-3 uppercase mb-8`}
                    >
                        {isUnlocking ? 'Unlocking...' : 'Unlock Secret'}
                        {showUnlockedIcon ? <Unlock size={24} /> : <Lock size={24} />}
                    </motion.button>
                </form>

                {/* HINT TEXT */}
                <p className="mt-2 text-black/60 font-bold italic uppercase text-sm tracking-wider">
                    I age quickly, but I'm picked every year. We cannot speak yet I say "I love you".
                    <br /><br />
                    <b className="text-black">What am I?</b>
                </p>

                {/* LOCK & KEY ANIMATION AREA */}
                <div className="mb-4 mt-8 bg-pink-100 border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#000] relative w-36 h-36 flex items-center justify-center z-0">
                    {/* The Lock Icon */}
                    <motion.div
                        className="relative z-10"
                        animate={showUnlockedIcon ? {
                            scale: [1, 1.3, 1],
                            rotate: [0, -10, 10, 0]
                        } : {}}
                        transition={{ duration: 0.5 }}
                    >
                        {showUnlockedIcon ? (
                            <Unlock size={60} className="text-black relative z-10" />
                        ) : (
                            <Lock size={60} className="text-black relative z-10" />
                        )}
                    </motion.div>

                    {/* The Flying Key */}
                    <motion.div
                        initial={false}
                        animate={isUnlocking ? {
                            x: [60, -100, -100, 0], // Circular path logic relative to start
                            y: [60, -60, 60, 0],
                            rotate: [0, 360, 720, 1080],
                            scale: [1, 1.5, 0.8, 1],
                            opacity: [1, 1, 1, 0] // Vanish into the lock
                        } : {
                            x: 60,
                            y: 60,
                            opacity: 1
                        }}
                        transition={{
                            duration: 1.2,
                            ease: "easeInOut",
                            repeat: isUnlocking ? 0 : Infinity,
                            repeatType: "reverse",
                            repeatDelay: 1
                        }}
                        className="absolute bg-red-500 rounded-full p-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] z-20"
                    >
                        <Key size={32} className="text-white" />
                    </motion.div>
                </div>

                {/* Comic dots/texture decoration */}
                <div className="absolute top-4 right-4 grid grid-cols-2 gap-1 opacity-20">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-black rounded-full" />
                    ))}
                </div>
            </motion.div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}} />
        </div>
    );
};

export default LockScreen;
