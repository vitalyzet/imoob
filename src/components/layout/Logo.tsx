import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  dark?: boolean; // si es true, la primera parte del texto se pone blanca
}

export default function Logo({ className = '', size = 'md', dark = false }: LogoProps) {
  // Ajustamos los tamaños manteniendo la proporción del nuevo texto
  const dimensions = {
    sm: { width: 95, height: 24 },
    md: { width: 130, height: 32 }, 
    lg: { width: 180, height: 44 },
    xl: { width: 280, height: 70 },
    custom: { width: 130, height: 32 },
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
        viewBox="0 0 160 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        style={{ display: 'block' }}
      >
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@800&family=Playfair+Display:ital,wght@1,700&display=swap');
            .logo-v { font-family: 'Playfair Display', serif; font-style: italic; font-size: 42px; }
            .logo-text { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 34px; letter-spacing: -1px; }
          `}
        </style>
        <text y="32">
          {/* 'V' elegante y clásica */}
          <tspan className="logo-v" fill={dark ? "#ffffff" : "#1e293b"}>V</tspan>
          {/* 'indu' moderno y geométrico */}
          <tspan className="logo-text" fill={dark ? "#ffffff" : "#1e293b"}>indu</tspan>
          {/* '24' en verde corporativo */}
          <tspan className="logo-text" fill="#139E69">24</tspan>
        </text>
      </svg>
    </div>
  );
}
