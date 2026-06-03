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
        <defs>
          {/* Patrón de cuadraditos para rellenar las letras de Vindu */}
          <pattern id="squarePattern" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
            <rect x="0.5" y="0.5" width="3.5" height="3.5" rx="0.5" fill={dark ? "#ffffff" : "#334155"} />
          </pattern>
        </defs>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap');
            .logo-text { font-family: 'Montserrat', sans-serif; font-weight: 900; font-size: 34px; letter-spacing: -1.5px; }
          `}
        </style>
        
        {/* 'Vindu' con textura de cuadraditos */}
        <text y="32" className="logo-text">
          <tspan fill="url(#squarePattern)">Vindu</tspan>
        </text>
        {/* '24' en Azul Cielo limpio */}
        <text y="32" x="102" className="logo-text">
          <tspan fill="#0ea5e9">24</tspan>
        </text>
      </svg>
    </div>
  );
}
