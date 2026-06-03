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
        viewBox="0 0 160 42" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        style={{ display: 'block' }}
      >
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap');
            .logo-text { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 34px; letter-spacing: -1.5px; }
          `}
        </style>
        
        {/* Texto del Logo */}
        <text y="32">
          {/* 'Vindu' en Gris muy oscuro elegante (o blanco si el fondo es oscuro) */}
          <tspan className="logo-text" fill={dark ? "#ffffff" : "#1e293b"}>Vindu</tspan>
          {/* '24' en el Azul Cielo de la sección Auto */}
          <tspan className="logo-text" fill="#0ea5e9">24</tspan>
        </text>

        {/* Onda / Swoosh Aerodinámico debajo del texto */}
        <path 
          d="M 2 37 C 30 44 60 26 90 37 C 115 45 140 37 158 32" 
          stroke="#0ea5e9" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          fill="none" 
          className="opacity-90"
        />
      </svg>
    </div>
  );
}
