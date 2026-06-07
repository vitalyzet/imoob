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

import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function generateMetadata(): Promise<Metadata> {
  let seo = {
    title: 'Vindu24 | Servicii Imobiliare și Auto',
    titleTemplate: '%s | Vindu24',
    description: 'Platforma ta de încredere pentru imobiliare și auto. Găsește proprietatea sau mașina de vis pe Vindu24.',
    keywords: 'imobiliare, auto, apartamente, case, masini, vanzari, inchirieri, vindu24',
    ogImage: 'https://vindu24.ro/og-image.jpg',
    siteName: 'Vindu24',
    author: 'Vindu24 Team',
  };

  try {
    const seoDoc = await getDoc(doc(db, 'settings', 'seo'));
    if (seoDoc.exists()) {
      seo = { ...seo, ...seoDoc.data() };
    }
  } catch (e) {
    console.error('Failed to fetch SEO settings from Firebase', e);
  }

  return {
    title: {
      template: seo.titleTemplate,
      default: seo.title,
    },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: seo.author }],
    openGraph: {
      title: seo.title,
      description: seo.description,
      siteName: seo.siteName,
      images: [{ url: seo.ogImage }],
      locale: 'ro_RO',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
    },
  };
}

import CookieConsent from '@/components/layout/CookieConsent';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className="scroll-smooth" suppressHydrationWarning>
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
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
