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
        viewBox="0 0 185 44" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        style={{ display: 'block' }}
      >
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap');
            .logo-vin { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 34px; letter-spacing: -1.5px; }
            .logo-du { font-family: 'Montserrat', sans-serif; font-weight: 400; font-size: 34px; letter-spacing: -1.5px; }
            .logo-24 { font-family: 'Montserrat', sans-serif; font-weight: 300; font-size: 34px; letter-spacing: -0.5px; }
            .logo-ro { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 16px; letter-spacing: -0.5px; }
          `}
        </style>

        <text y="34" x="2">
          {/* 'Vin' grueso */}
          <tspan className="logo-vin" fill={dark ? "#ffffff" : "#1e293b"}>Vin</tspan>
          {/* 'du' menos grueso */}
          <tspan className="logo-du" fill={dark ? "#ffffff" : "#1e293b"}>du</tspan>
          {/* '24' fino en azul */}
          <tspan className="logo-24" fill={dark ? "#60a5fa" : "#0ea5e9"}>24</tspan>
          {/* '.ro' pegadito y más pequeño */}
          <tspan className="logo-ro" fill={dark ? "#94a3b8" : "#64748b"} dx="2">.ro</tspan>
        </text>
      </svg>
    </div>
  );
}

