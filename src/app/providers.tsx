'use client';

import { AuthProvider } from '@/context/AuthContext';
import { DomainProvider } from '@/context/DomainContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DomainProvider>
        {children}
      </DomainProvider>
    </AuthProvider>
  );
}
