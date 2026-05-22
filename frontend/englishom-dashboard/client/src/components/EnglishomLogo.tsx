import React from 'react';

interface EnglishomLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function EnglishomLogo({ size = 'md', className = '' }: EnglishomLogoProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${sizeMap[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background - Neon Dark */}
      <rect width="100" height="100" fill="#0f172a" rx="8" />

      {/* House Shape - Roof - Neon Yellow */}
      <path
        d="M 50 20 L 75 45 L 70 45 L 70 70 L 30 70 L 30 45 L 25 45 Z"
        fill="#FFFF00"
        filter="url(#neonGlow)"
      />

      {/* Roof Lines - Neon Red */}
      <line x1="50" y1="20" x2="35" y2="45" stroke="#FF0000" strokeWidth="2" />
      <line x1="50" y1="20" x2="45" y2="45" stroke="#FF0000" strokeWidth="2" />
      <line x1="50" y1="20" x2="55" y2="45" stroke="#FF0000" strokeWidth="2" />
      <line x1="50" y1="20" x2="65" y2="45" stroke="#FF0000" strokeWidth="2" />

      {/* Window - Neon Cyan */}
      <rect x="42" y="50" width="16" height="12" fill="#00FFFF" />
      <line x1="50" y1="50" x2="50" y2="62" stroke="#0f172a" strokeWidth="1" />
      <line x1="42" y1="56" x2="58" y2="56" stroke="#0f172a" strokeWidth="1" />

      {/* Neon Glow Effect */}
      <defs>
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.8" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
