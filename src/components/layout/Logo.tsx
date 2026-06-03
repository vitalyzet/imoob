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
        viewBox="0 0 170 48" 
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

        {/* Texto principal */}
        <text y="30">
          <tspan className="logo-text" fill={dark ? "#ffffff" : "#475569"}>Vindu</tspan>
          <tspan className="logo-text" fill="#0ea5e9">24</tspan>
        </text>

        {/* Cuadraditos salpicados debajo del texto */}
        <rect x="8" y="35" width="4" height="4" rx="0.8" fill="#0ea5e9" opacity="0.7" />
        <rect x="22" y="37" width="2.5" height="2.5" rx="0.5" fill="#0ea5e9" opacity="0.4" />
        <rect x="36" y="34" width="3.5" height="3.5" rx="0.7" fill="#0ea5e9" opacity="0.55" />
        <rect x="50" y="38" width="2" height="2" rx="0.4" fill="#0ea5e9" opacity="0.3" />
        <rect x="62" y="35" width="4.5" height="4.5" rx="0.9" fill="#0ea5e9" opacity="0.6" />
        <rect x="78" y="37" width="3" height="3" rx="0.6" fill="#0ea5e9" opacity="0.45" />
        <rect x="92" y="34" width="2.5" height="2.5" rx="0.5" fill="#0ea5e9" opacity="0.35" />
        <rect x="105" y="36" width="4" height="4" rx="0.8" fill="#0ea5e9" opacity="0.65" />
        <rect x="118" y="38" width="2" height="2" rx="0.4" fill="#0ea5e9" opacity="0.25" />
        <rect x="130" y="35" width="3.5" height="3.5" rx="0.7" fill="#0ea5e9" opacity="0.5" />
        <rect x="145" y="37" width="2.5" height="2.5" rx="0.5" fill="#0ea5e9" opacity="0.4" />
        <rect x="155" y="34" width="3" height="3" rx="0.6" fill="#0ea5e9" opacity="0.3" />

        {/* Segunda fila de cuadraditos más abajo, más dispersos */}
        <rect x="15" y="42" width="2" height="2" rx="0.4" fill="#0ea5e9" opacity="0.2" />
        <rect x="42" y="43" width="2.5" height="2.5" rx="0.5" fill="#0ea5e9" opacity="0.3" />
        <rect x="70" y="42" width="3" height="3" rx="0.6" fill="#0ea5e9" opacity="0.2" />
        <rect x="100" y="43" width="2" height="2" rx="0.4" fill="#0ea5e9" opacity="0.25" />
        <rect x="135" y="42" width="2.5" height="2.5" rx="0.5" fill="#0ea5e9" opacity="0.15" />
      </svg>
    </div>
  );
}
