import React from 'react';

interface TritiumLogoProps {
  size?: number;
  glow?: boolean;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

export const TritiumLogo: React.FC<TritiumLogoProps> = ({
  size = 40,
  glow = true,
  animated = false,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: glow ? 'drop-shadow(0 0 8px var(--color-accent-cyan)) drop-shadow(0 0 2px rgba(37, 99, 235, 0.4))' : 'none',
          animation: animated ? 'spin-logo 25s linear infinite' : 'none',
        }}
      >
        <defs>
          <linearGradient id="crystal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="inner-glow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        
        {/* Outer Tech Hexagon Shield */}
        <polygon
          points="50,12 83,31 83,69 50,88 17,69 17,31"
          fill="rgba(6, 182, 212, 0.03)"
          stroke="url(#crystal-gradient)"
          strokeWidth="2.5"
          opacity="0.85"
        />
        
        {/* Inner Crystalline Tri-Prong Core */}
        <path
          d="M50,18 V46 L74,60"
          stroke="url(#crystal-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50,46 L26,60"
          stroke="url(#crystal-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Energy Spark */}
        <circle cx="50" cy="46" r="8" fill="url(#inner-glow)" />
        <circle cx="50" cy="46" r="3" fill="#ffffff" />
      </svg>
    </div>
  );
};
export default TritiumLogo;
