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
        viewBox="0 0 170 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        style={{ display: 'block' }}
      >
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap');
            .logo-text { font-family: 'Montserrat', sans-serif; font-weight: 900; font-size: 34px; letter-spacing: -1.5px; }
          `}
        </style>

        {/* Cuadraditos decorativos alrededor del texto */}
        <rect x="0" y="2" width="4" height="4" rx="0.8" fill="#0ea5e9" opacity="0.3" />
        <rect x="7" y="0" width="3" height="3" rx="0.6" fill="#0ea5e9" opacity="0.5" />
        <rect x="3" y="9" width="2.5" height="2.5" rx="0.4" fill="#0ea5e9" opacity="0.2" />
        
        <rect x="148" y="5" width="4" height="4" rx="0.8" fill="#0ea5e9" opacity="0.4" />
        <rect x="155" y="1" width="3" height="3" rx="0.6" fill="#0ea5e9" opacity="0.25" />
        <rect x="150" y="12" width="2.5" height="2.5" rx="0.4" fill="#0ea5e9" opacity="0.15" />

        {/* Texto principal */}
        <text y="32">
          <tspan className="logo-text" fill={dark ? "#ffffff" : "#475569"}>Vindu</tspan>
          <tspan className="logo-text" fill="#0ea5e9">24</tspan>
        </text>

        {/* Punto cuadrado como separador entre Vindu y 24 */}
        <rect x="99" y="22" width="4" height="4" rx="0.8" fill="#0ea5e9" opacity="0.6" />
      </svg>
    </div>
  );
}
