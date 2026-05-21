import PropertyPublishForm from '@/components/properties/PropertyPublishForm';

export default async function EditarAnuncio({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PropertyPublishForm editId={id} />;
}
