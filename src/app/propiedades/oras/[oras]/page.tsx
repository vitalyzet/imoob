import { Metadata } from 'next';
import { Suspense } from 'react';
import PropertiesClient from '../../client';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ oras: string }> }): Promise<Metadata> {
  const { oras } = await params;
  const decodedOras = decodeURIComponent(oras);
  const formattedOras = decodedOras.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

  let siteName = 'Vindu24';
  
  try {
    const seoDoc = await getDoc(doc(db, 'settings', 'seo'));
    if (seoDoc.exists()) {
      const data = seoDoc.data();
      if (data.siteName) siteName = data.siteName;
    }
  } catch (e) {
    console.error('Error fetching SEO in propiedades/oras', e);
  }

  const title = `Apartamente și Case de vânzare în ${formattedOras} | ${siteName}`;
  const desc = `Cauți locuințe în ${formattedOras}? Descoperă sute de anunțuri cu apartamente, case și garsoniere de vânzare și închiriere în ${formattedOras} pe ${siteName}.`;

  return {
    title,
    description: desc,
    keywords: `imobiliare ${formattedOras}, apartamente ${formattedOras}, case de vanzare ${formattedOras}, chirii ${formattedOras}, agentie imobiliara ${formattedOras}, vindu24`,
    openGraph: {
      title,
      description: desc,
      type: 'website',
      url: `https://vindu24.ro/propiedades/oras/${encodeURIComponent(oras)}`,
    },
    alternates: {
      canonical: `https://vindu24.ro/propiedades/oras/${encodeURIComponent(oras)}`,
    }
  };
}

export default async function PropiedadesOrasPage({ params }: { params: Promise<{ oras: string }> }) {
  const { oras } = await params;
  const decodedOras = decodeURIComponent(oras);
  const formattedOras = decodedOras.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 text-gray-900">
      <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div></div>}>
        <PropertiesClient initialProperties={[]} initialFilters={{ city: formattedOras }} />
      </Suspense>
    </div>
  );
}
