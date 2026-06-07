import { Metadata } from 'next';
import { Suspense } from 'react';
import PropertiesClient from './client';

export const dynamic = 'force-dynamic';

import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function generateMetadata(): Promise<Metadata> {
  let siteName = 'Vindu24';
  let desc = 'Găsește apartamente, case, terenuri și spații comerciale de vânzare și închiriere pe Vindu24.';
  
  try {
    const seoDoc = await getDoc(doc(db, 'settings', 'seo'));
    if (seoDoc.exists()) {
      const data = seoDoc.data();
      if (data.siteName) siteName = data.siteName;
    }
  } catch (e) {
    console.error('Error fetching SEO in propiedades/page.tsx', e);
  }

  const title = `Imobiliare - Anunțuri apartamente și case | ${siteName}`;

  return {
    title,
    description: desc,
    keywords: 'imobiliare, apartamente, case, terenuri, vanzari, inchirieri, vindu24',
    openGraph: {
      title,
      description: desc,
      type: 'website',
      url: 'https://vindu24.ro/propiedades',
    },
    alternates: {
      canonical: 'https://vindu24.ro/propiedades',
    }
  };
}

export default function PropiedadesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 text-gray-900">
      <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div></div>}>
        <PropertiesClient initialProperties={[]} />
      </Suspense>
    </div>
  );
}
