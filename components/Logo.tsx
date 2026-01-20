
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 32 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="logo-pulse"
      >
        <path 
          d="M20 20L80 80M80 20L20 80" 
          stroke="url(#redGradient)" 
          strokeWidth="12" 
          strokeLinecap="round" 
        />
        <defs>
          <linearGradient id="redGradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff4d4d" />
            <stop offset="1" stopColor="#990000" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Logo;
