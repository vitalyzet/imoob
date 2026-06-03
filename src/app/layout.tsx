import type { Metadata } from 'next';
import { Ubuntu } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Providers } from './providers';
import AgentProfileModal from '@/components/profile/AgentProfileModal';
import { Suspense } from 'react';

const ubuntu = Ubuntu({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'], 
  variable: '--font-sans' 
});

export const metadata: Metadata = {
  title: {
    template: '%s | Xmobe - Inmobiliaria',
    default: 'Xmobe | Servicios Inmobiliarios',
  },
  description: 'Xmobe. Innovación y tecnología al servicio del sector inmobiliario. Encontramos la propiedad perfecta para usted.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
        <body suppressHydrationWarning className={`${ubuntu.variable} font-sans min-h-screen flex flex-col antialiased bg-[var(--background)] text-[var(--foreground)]`}>
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
            <Suspense fallback={null}>
              <AgentProfileModal />
            </Suspense>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
