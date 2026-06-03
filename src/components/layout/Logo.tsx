import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  dark?: boolean; // si es true, aplica un filtro para hacer el logo blanco en fondos oscuros
}

export default function Logo({ className = '', size = 'md', dark = false }: LogoProps) {
  // Ajustamos los tamaños para que el logo se vea un poco más pequeño, compacto y elegante
  // Mantenemos la relación de aspecto perfecta de ~4.11:1.
  const dimensions = {
    sm: { width: 82, height: 20 },
    md: { width: 115, height: 28 }, // El logotipo ahora es más compacto (altura baja de 32px a 28px)
    lg: { width: 164, height: 40 },
    xl: { width: 246, height: 60 },
    custom: { width: 115, height: 28 },
  };

  const { width, height } = dimensions[size === 'custom' ? 'md' : size];

  // Si dark es true, invertimos la imagen a blanco puro para fondos oscuros.
  const filterStyle = dark ? { filter: 'brightness(0) invert(1)' } : undefined;

  return (
    <div 
      className={`inline-flex items-center select-none ${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`, 
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <img 
        src="/xmobe.png" 
        alt="Xmobe Logo" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          ...filterStyle
        }}
      />
    </div>
  );
}
