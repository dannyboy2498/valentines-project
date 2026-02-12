import React from 'react';
import { Clock } from 'lucide-react';

const CountdownScreen = ({ timeRemaining }) => {
    const seconds = Math.floor((timeRemaining / 1000) % 60);
    const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
    const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

    const TimeUnit = ({ label, value }) => (
        <div className="flex flex-col items-center justify-center p-2 border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000]">
            <span className="text-2xl font-black font-mono leading-none">
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-black uppercase mt-1">
                {label}
            </span>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-pink-50">
            <div className="border-8 border-black p-8 bg-white shadow-[15px_15px_0px_0px_#000] max-w-sm w-full text-center">
                <Clock size={40} className="mx-auto mb-6 border-4 border-black p-2 bg-white shadow-[4px_4px_0px_0px_#000]" />

                <h1 className="text-2xl font-black uppercase mb-8 border-b-4 border-black pb-4 leading-tight">
                    Something special is coming...
                </h1>

                <div className="grid grid-cols-4 gap-2">
                    <TimeUnit label="Days" value={days} />
                    <TimeUnit label="Hours" value={hours} />
                    <TimeUnit label="Mins" value={minutes} />
                    <TimeUnit label="Secs" value={seconds} />
                </div>
            </div>
        </div>
    );
};

export default CountdownScreen;
