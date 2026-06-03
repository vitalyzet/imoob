'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AgentAvatarProps {
  initialImage: string;
  name: string;
}

export default function AgentAvatar({ initialImage, name }: AgentAvatarProps) {
  const [image, setImage] = useState(initialImage);

  useEffect(() => {
    // Check if there's a local logo (for the current user viewing their own ad)
    const localLogo = localStorage.getItem('vindu24_user_logo');
    if (localLogo) {
      setImage(localLogo);
    }

    // Optional: listen for changes if the user uploads a new logo while on this page
    const handleLogoChange = (e: CustomEvent) => {
      setImage(e.detail);
    };

    window.addEventListener('user-logo-changed', handleLogoChange as EventListener);
    return () => window.removeEventListener('user-logo-changed', handleLogoChange as EventListener);
  }, [initialImage]);

  return (
    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 flex-shrink-0 shadow-sm">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e: any) => {
          e.target.src = initialImage;
        }}
      />
    </div>
  );
}
