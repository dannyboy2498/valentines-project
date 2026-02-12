import React from 'react';
import { Heart } from 'lucide-react';

const MailSymbol = () => (
    /* Vertically shifted slightly down within the 280px container to be closer to text */
    <div className="w-[280px] h-[280px] flex items-center justify-center relative pt-8">
        {/* Envelope Body - Subtle Rounded Rect (rounded-lg) with 8px Border */}
        {/* Scaled up 1.2x to match the visual presence of the square cat memes */}
        <div className="w-72 h-44 relative shadow-[10px_10px_0px_0px_#000] bg-white border-[8px] border-black rounded-lg box-border overflow-hidden scale-110">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
                {/* 1. Underlying Side Base Fills */}
                <path d="M 0 0 L 50 38 L 0 60 Z" fill="#fff0f3" />
                <path d="M 100 0 L 50 38 L 100 60 Z" fill="#fff0f3" />

                {/* 2. Bottom Segment Shading */}
                <path d="M 0 60 L 100 60 L 62 30 L 50 38 L 40 30 Z" fill="#ffccd5" />

                {/* 3. Top Flap Base Fill */}
                <path d="M 0 0 L 100 0 L 50 40 Z" fill="#fff5f5" />

                {/* 4. Comic Structural Lines - Smaller inner lines (3.5px) */}
                <path d="M 0 60 L 38 30" fill="none" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 100 60 L 62 30" fill="none" stroke="black" strokeWidth="3.5" strokeLinecap="round" />

                {/* 5. Masking Layer */}
                <path d="M 0 0 L 100 0 L 50 40 Z" fill="#fff5f5" />

                {/* 6. Top Flap "V" */}
                <path d="M 0 0 L 50 40 L 100 0" fill="none" stroke="black" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Heart Seal - Perfectly Centered */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                <Heart size={110} className="text-red-500 fill-red-500 animate-pulse drop-shadow-[7px_7px_0px_#000]" />
            </div>
        </div>
    </div>
);

export default MailSymbol;
