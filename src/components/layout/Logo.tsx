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
        viewBox="0 0 170 56" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        style={{ display: 'block' }}
      >
        <defs>
          {/* Degradado para el arco: de sutil a sólido */}
          <linearGradient id="arcGrad" x1="0%" y1="50%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={dark ? "#ffffff" : "#0ea5e9"} stopOpacity="0.1" />
            <stop offset="35%" stopColor={dark ? "#ffffff" : "#0ea5e9"} stopOpacity="0.4" />
            <stop offset="100%" stopColor={dark ? "#60a5fa" : "#0ea5e9"} stopOpacity="1" />
          </linearGradient>
        </defs>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap');
            .logo-text { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: -1.2px; }
          `}
        </style>

        {/* Arco circular que envuelve el texto */}
        <path 
          d="M 72 44 A 24 24 0 1 1 128 44"
          stroke="url(#arcGrad)" 
          strokeWidth="2.8" 
          strokeLinecap="round" 
          fill="none"
        />

        {/* Texto principal centrado dentro del arco */}
        <text y="38" x="12">
          <tspan className="logo-text" fill={dark ? "#ffffff" : "#1e293b"}>Vindu</tspan>
          <tspan className="logo-text" fill={dark ? "#60a5fa" : "#0ea5e9"}>24</tspan>
        </text>
      </svg>
    </div>
  );
}

