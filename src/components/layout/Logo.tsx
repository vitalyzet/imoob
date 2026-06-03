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
        <defs>
          {/* Clip para que las burbujas solo se vean dentro de las letras */}
          <clipPath id="vinduClip">
            <text y="34" x="2" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="32" letterSpacing="-1.2">Vindu</text>
          </clipPath>
        </defs>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap');
            .logo-text { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: -1.2px; }
          `}
        </style>

        {/* Texto base de Vindu */}
        <text y="34" x="2" className="logo-text" fill={dark ? "#ffffff" : "#1e293b"}>Vindu</text>

        {/* Burbujas recortadas dentro de las letras */}
        <g clipPath="url(#vinduClip)">
          {/* Burbujas grandes */}
          <circle cx="14" cy="20" r="5" fill="#0ea5e9" opacity="0.25" />
          <circle cx="38" cy="30" r="6" fill="#0ea5e9" opacity="0.2" />
          <circle cx="62" cy="18" r="5.5" fill="#0ea5e9" opacity="0.22" />
          <circle cx="82" cy="28" r="7" fill="#0ea5e9" opacity="0.18" />
          <circle cx="98" cy="22" r="5" fill="#0ea5e9" opacity="0.25" />
          
          {/* Burbujas medianas */}
          <circle cx="8" cy="32" r="3.5" fill="#0ea5e9" opacity="0.35" />
          <circle cx="28" cy="18" r="3" fill="#0ea5e9" opacity="0.3" />
          <circle cx="50" cy="26" r="4" fill="#0ea5e9" opacity="0.28" />
          <circle cx="70" cy="32" r="3.5" fill="#0ea5e9" opacity="0.32" />
          <circle cx="90" cy="16" r="3" fill="#0ea5e9" opacity="0.3" />
          
          {/* Burbujas pequeñas (brillos) */}
          <circle cx="18" cy="28" r="2" fill="#38bdf8" opacity="0.45" />
          <circle cx="42" cy="16" r="1.5" fill="#38bdf8" opacity="0.5" />
          <circle cx="55" cy="34" r="2" fill="#38bdf8" opacity="0.4" />
          <circle cx="75" cy="14" r="1.5" fill="#38bdf8" opacity="0.45" />
          <circle cx="95" cy="30" r="2" fill="#38bdf8" opacity="0.42" />
          <circle cx="22" cy="14" r="1" fill="#7dd3fc" opacity="0.6" />
          <circle cx="46" cy="24" r="1.2" fill="#7dd3fc" opacity="0.55" />
          <circle cx="66" cy="28" r="1" fill="#7dd3fc" opacity="0.6" />
          <circle cx="86" cy="20" r="1.2" fill="#7dd3fc" opacity="0.55" />
        </g>

        {/* "24" en azul cielo limpio */}
        <text y="34" x="100" className="logo-text" fill={dark ? "#60a5fa" : "#0ea5e9"}>24</text>
      </svg>
    </div>
  );
}

