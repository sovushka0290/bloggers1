import React from 'react';

interface TrophySvgProps {
  className?: string;
}

export const TrophySvg: React.FC<TrophySvgProps> = ({ className = 'w-16 h-28' }) => {
  return (
    <svg
      viewBox="0 0 140 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="trophyGoldMain" x1="20" y1="10" x2="120" y2="230" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF7DF" />
          <stop offset="28%" stopColor="#F0CB80" />
          <stop offset="58%" stopColor="#C18F3B" />
          <stop offset="82%" stopColor="#FCE4A6" />
          <stop offset="100%" stopColor="#8C621F" />
        </linearGradient>
        <linearGradient id="trophyGoldHighlight" x1="70" y1="0" x2="70" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#F5D793" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#9E6E24" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="trophyFlare" cx="50%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#FFF6D6" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#D9B26A" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#D9B26A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft Aura */}
      <circle cx="70" cy="95" r="65" fill="url(#trophyFlare)" />

      {/* Tall Sculptural Spiral Blade Left */}
      <path
        d="M52 24L68 14L76 186H58C58 186 44 96 52 24Z"
        fill="url(#trophyGoldMain)"
      />
      <path
        d="M54 25L63 18L68 186H59C59 186 49 98 54 25Z"
        fill="url(#trophyGoldHighlight)"
        opacity="0.6"
      />

      {/* Sweeping Spiral Ribbon */}
      <path
        d="M42 52C62 84 82 128 84 186H68C66 135 50 92 34 58L42 52Z"
        fill="url(#trophyGoldMain)"
      />

      {/* Right Ascending Wing */}
      <path
        d="M84 44L98 34C98 34 86 118 78 186H64C71 122 84 44 84 44Z"
        fill="url(#trophyGoldMain)"
      />
      <path
        d="M85 44L93 38C91 75 82 135 76 186H70C76 132 85 44 85 44Z"
        fill="url(#trophyGoldHighlight)"
        opacity="0.45"
      />

      {/* Pedestal Ring Neck */}
      <rect x="46" y="186" width="48" height="7" rx="2" fill="url(#trophyGoldMain)" />
      <rect x="40" y="193" width="60" height="9" rx="2" fill="url(#trophyGoldMain)" />

      {/* Heavy Stepped Base */}
      <path d="M32 202H108L114 218H26L32 202Z" fill="url(#trophyGoldMain)" />
      <rect x="22" y="218" width="96" height="10" rx="2" fill="url(#trophyGoldMain)" />
      <rect x="26" y="218" width="88" height="2" fill="#FFF7DF" opacity="0.7" />
      <rect x="32" y="202" width="76" height="2" fill="#FFF7DF" opacity="0.6" />
    </svg>
  );
};
