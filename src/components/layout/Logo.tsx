import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  dark?: boolean;
}

export default function Logo({ className = '', size = 'md', dark = false }: LogoProps) {
  const dimensions = {
    sm: { width: 100, height: 34 },
    md: { width: 140, height: 46 },
    lg: { width: 190, height: 64 },
    xl: { width: 290, height: 96 },
    custom: { width: 140, height: 46 },
  };

  const { width, height } = dimensions[size === 'custom' ? 'md' : size];

  return (
    <div 
      className={`inline-flex items-center select-none ${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`, 
        overflow: 'visible',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 170 44" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        style={{ display: 'block' }}
      >
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;800&display=swap');
            .logo-vindu { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 34px; letter-spacing: -1.5px; }
            .logo-24 { font-family: 'Montserrat', sans-serif; font-weight: 300; font-size: 34px; letter-spacing: -0.5px; }
          `}
        </style>

        <text y="34" x="2">
          {/* 'Vindu' con mucha fuerza (ExtraBold) */}
          <tspan className="logo-vindu" fill={dark ? "#ffffff" : "#1e293b"}>Vindu</tspan>
          {/* '24' muy fino y elegante (Light) */}
          <tspan className="logo-24" fill={dark ? "#60a5fa" : "#0ea5e9"}>24</tspan>
        </text>

        {/* Punto final elegante */}
        <circle cx="140" cy="30" r="3.5" fill={dark ? "#60a5fa" : "#0ea5e9"} />
      </svg>
    </div>
  );
}

