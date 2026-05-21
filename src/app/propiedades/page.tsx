import { Metadata } from 'next';
import PropertiesClient from './client';

export const metadata: Metadata = {
  title: 'Catálogo de Propiedades Exclusivas',
  description: 'Explora nuestra selección de villas, penthouses y apartamentos de lujo en España.',
};

export default function PropiedadesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 text-gray-900">
      <PropertiesClient initialProperties={[]} />
    </div>
  );
}
