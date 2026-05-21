import { Metadata } from 'next';
import { Suspense } from 'react';
import AutoResultsClient from './client';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Catálogo de Coches y Vehículos',
  description: 'Explora nuestra selección de coches de lujo y vehículos en venta.',
};

export default function AutoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f8fa] pt-32 flex justify-center"><Loader2 className="animate-spin text-slate-400" size={48} /></div>}>
      <AutoResultsClient />
    </Suspense>
  );
}
