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
        <text 
          x="0" 
          y="32" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontWeight="800" 
          fontSize="36" 
          letterSpacing="-1.5"
        >
          {/* El nombre "Vindu" cambia a blanco en fondos oscuros (dark=true), si no, gris oscuro */}
          <tspan fill={dark ? "#ffffff" : "#1e293b"}>Vindu</tspan>
          {/* El "24" siempre se queda en tu color verde corporativo */}
          <tspan fill="#139E69">24</tspan>
        </text>
      </svg>
    </div>
  );
}
