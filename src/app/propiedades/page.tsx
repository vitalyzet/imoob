import { Metadata } from 'next';
import { Suspense } from 'react';
import PropertiesClient from './client';

export const metadata: Metadata = {
  title: 'Catálogo de Propiedades Exclusivas',
  description: 'Explora nuestra selección de villas, penthouses y apartamentos de lujo en España.',
};

export default function PropiedadesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 text-gray-900">
      <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div></div>}>
        <PropertiesClient initialProperties={[]} />
      </Suspense>
    </div>
  );
}
