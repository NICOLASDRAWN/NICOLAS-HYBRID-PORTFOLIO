import React from 'react';

interface MIPLogoProps {
    className?: string;
}

export const MIPLogo: React.FC<MIPLogoProps> = ({ className = "w-full h-full" }) => (
    <svg
        viewBox="0 0 400 100"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        preserveAspectRatio="xMidYMid meet"
    >
        {/* Abstract Icon/Symbol M-I-P */}
        <defs>
            <linearGradient id="mipGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#059669" /> {/* Emerald 600 */}
                <stop offset="100%" stopColor="#2563EB" /> {/* Blue 600 */}
            </linearGradient>
        </defs>

        {/* Symbol */}
        <path
            d="M20 80 L20 20 L50 60 L80 20 L80 80 M95 80 L95 20 M120 20 L150 20 C170 20 170 60 150 60 L120 60 L120 80"
            fill="none"
            stroke="url(#mipGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
        />

        {/* Text */}
        <text x="190" y="50" fontFamily="sans-serif" fontWeight="900" fontSize="32" fill="#0F172A">
            MIP
        </text>
        <text x="190" y="80" fontFamily="sans-serif" fontWeight="600" fontSize="16" fill="#64748B" letterSpacing="2">
            INTERNACIONAL
        </text>
    </svg>
);
