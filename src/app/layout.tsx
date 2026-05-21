import type { Metadata } from 'next';
import { Ubuntu } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Providers } from './providers';

const ubuntu = Ubuntu({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'], 
  variable: '--font-sans' 
});

export const metadata: Metadata = {
  title: {
    template: '%s | IMOOB - Inmobiliaria',
    default: 'IMOOB | Servicios Inmobiliarios',
  },
  description: 'IMOOB. Innovación y tecnología al servicio del sector inmobiliario. Encontramos la propiedad perfecta para usted.',
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
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
