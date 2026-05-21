import Image from 'next/image';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { MapPin, Bed, Box, ShowerHead, UtensilsCrossed, Dumbbell, Bus, ShoppingBag, GraduationCap, Stethoscope, Utensils, Landmark, ParkingSquare, Building2, Bath, Square, Calendar, Check, Heart, Share2, Printer, ChevronRight, Layers3, Bell, Crown, Info, CheckCircle2, Sun, Phone, MessageCircle, Users, Home, Snowflake, Key, Dog, Zap, Eye, Flag } from 'lucide-react';
import Link from 'next/link';
import PropertyGallery from '@/components/properties/PropertyGallery';
import ContactForm from '@/components/properties/ContactForm';
import SecondaryActions from '@/components/properties/SecondaryActions';
import NotificationCard from '@/components/properties/NotificationCard';
import AmenitiesSection from '@/components/properties/AmenitiesSection';
import AgentAvatar from '@/components/properties/AgentAvatar';
import PropertyActionButtons from '@/components/properties/PropertyActionButtons';

export const dynamic = 'force-dynamic';

async function getPropertyData(slug: string) {
  try {
    const docRef = doc(db, 'anuncios', slug);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    const d = docSnap.data();
    
    let mappedType = d.type || 'apartment';
    let mappedOperation = d.operation === 'vender' || d.operation === 'vanzare' ? 'vanzare' : 'inchiriere';
    
    // Corecție automată: camerele sunt automat de închiriat (pentru a acoperi vechile erori DB)
    if (mappedType === 'camera') {
       mappedOperation = 'inchiriere';
    }
    
    const status = mappedOperation === 'vanzare' ? 'for-sale' : 'for-rent';
    const typeName = mappedType === 'camera' ? 'Cameră' : (mappedType.charAt(0).toUpperCase() + mappedType.slice(1));
    const operationName = mappedOperation === 'vanzare' ? 'de Vânzare' : 'de Închiriat';
    
    const generatedTitle = `${typeName} ${operationName} în ${d.localitate || d.city || 'România'}`;
    
    return {
      id: docSnap.id,
      title: d.title || generatedTitle,
      slug: docSnap.id,
      type: mappedType,
      price: Number(d.price) || 0,
      pretNegociabil: d.pretNegociabil || false,
      operation: mappedOperation,
      status: status,
      location: {
        judet: d.judet || '',
        localitate: d.localitate || '',
        strada: d.strada || '',
        numar: d.numar || '',
        bloc: d.bloc || '',
        scara: d.scara || '',
        etaj: d.etaj || '',
        apartament: d.apartament || '',
        codPostal: d.codPostal || '',
        hideExactAddress: d.hideExactAddress || false,
        address: d.address || '',
        city: d.localitate || d.city || '',
      },
      features: {
        bedrooms: parseInt(d.rooms) || parseInt(d.bedrooms) || 0,
        bathrooms: parseInt(d.baths) || parseInt(d.bai) || parseInt(d.bathrooms) || 0,
        area: parseFloat(d.area) || parseFloat(d.suprafataUtila) || 0,
        floors: parseInt(d.floor) || parseInt(d.nrNiveluri) || 1,
      },
      techDetails: {
        compartimentare: d.compartimentare || '',
        confort: d.confort || '',
        condition: d.condition || '',
        yearBuilt: d.yearBuilt || '',
        tipImobil: d.tipImobil || '',
        nrNiveluri: d.nrNiveluri || '',
        nrBucatarii: d.nrBucatarii || '',
        nrBalcoane: d.nrBalcoane || '',
        suprafataTeren: d.suprafataTeren || '',
        energyCertificate: d.energyCertificate || '',
        subsol: d.subsol || false,
        demisol: d.demisol || false,
        mansardaCheck: d.mansardaCheck || false,
        categorieComercial: d.categorieComercial || '',
        pretPeMp: d.pretPeMp || 'total',
      },
      roommateDetails: d.type === 'camera' ? {
        cautaColeg: d.cautaColeg || false,
        nrPersoaneActual: d.nrPersoaneActual || '',
        preferinteColeg: d.preferinteColeg || '',
        cheltuieliIncluse: d.cheltuieliIncluse || 'nu',
        frigiderPersonal: d.frigiderPersonal || 'la comun',
        cameraCuCheie: d.cameraCuCheie || 'nu',
        animaleAceptate: d.animaleAceptate || 'nu'
      } : null,
      images: d.images?.length > 0 ? d.images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000'],
      description: d.description ? d.description.substring(0, 100) + '...' : 'Fără descriere pentru acest anunț.',
      longDescription: d.description || 'Proprietarul nu a oferit o descriere detaliată pentru acest imobil.',
      amenities: (d.amenities as string[]) || [],
      createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : (d.createdAt || new Date().toISOString()),
      views: d.views || Math.floor(Math.random() * 200) + 20,
      favoritesCount: d.favoritesCount || Math.floor(Math.random() * 15) + 5,
      agent: {
        id: d.email || 'anonimo',
        name: d.name || 'Proprietar Anonim',
        role: "Proprietar Particular",
        phone: d.phone || "+40 000 000 000",
        image: d.agentImage || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256",
      }
    };
  } catch (err) {
    console.error("Error fetching property layout:", err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyData(slug);
  
  if (!property) return { title: 'Proprietate negăsită' };
 
  return {
    title: property.title + ' | IMOOB',
    description: property.description,
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyData(slug);

  if (!property) notFound();

  const formattedPrice = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(property.price);

  const propertyTypeLabel = property.type === 'camera' ? 'Cameră' : (property.type.charAt(0).toUpperCase() + property.type.slice(1));

  const propertyStatusLabel = property.operation === 'inchiriere' ? 'de închiriat' : 'de vânzare';

  let relatedAds: any[] = [];
  try {
    // 1. Fetch seller properties (limit to 2)
    const sq = query(
      collection(db, 'anuncios'), 
      where('email', '==', property.agent.id),
      where('status', '==', 'active')
    );
    const sSnap = await getDocs(sq);
    const sellerProperties = sSnap.docs
       .filter(doc => doc.id !== property.id)
       .map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            title: `${d.type ? d.type.charAt(0).toUpperCase() + d.type.slice(1) : 'Imobil'} de ${d.operation === 'vanzare' || d.operation === 'vender' ? 'vânzare' : 'închiriat'} în ${d.city || ''}`,
            slug: doc.id,
            price: Number(d.price) || 0,
      pretNegociabil: d.pretNegociabil || false,
            status: d.operation === 'vender' ? 'for-sale' : 'for-rent',
            location: { city: d.city || '', state: d.zipCode || '' },
            features: { bedrooms: d.rooms || 0, bathrooms: d.baths || 0, area: d.area || 0 },
            images: d.images?.length > 0 ? d.images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000'],
            isSponsored: d.promoType === 'gold',
            promoType: d.promoType
          };
       }).slice(0, 2);

    // 2. Fetch sponsored gold properties (intelligent geo-targeting)
    // Priority 1: Gold ads in the same city
    const localGQ = query(
      collection(db, 'anuncios'),
      where('promoType', '==', 'gold'),
      where('city', '==', property.location.city),
      where('status', '==', 'active')
    );
    let gSnap = await getDocs(localGQ);
    let sponsoredMatches = gSnap.docs.filter(doc => doc.id !== property.id && doc.data().email !== property.agent.id);

    // Priority 2: Fallback to any Gold ads if no local match
    if (sponsoredMatches.length === 0) {
      const globalGQ = query(
        collection(db, 'anuncios'),
        where('promoType', '==', 'gold'),
        where('status', '==', 'active')
      );
      gSnap = await getDocs(globalGQ);
      sponsoredMatches = gSnap.docs.filter(doc => doc.id !== property.id && doc.data().email !== property.agent.id);
    }

    const sponsoredProperties = sponsoredMatches
      .map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          title: `${d.type ? d.type.charAt(0).toUpperCase() + d.type.slice(1) : 'Imobil'} de ${d.operation === 'vanzare' || d.operation === 'vender' ? 'vânzare' : 'închiriat'} în ${d.city || ''}`,
          slug: doc.id,
          price: Number(d.price) || 0,
      pretNegociabil: d.pretNegociabil || false,
          status: d.operation === 'vender' ? 'for-sale' : 'for-rent',
          location: { city: d.city || '', state: d.zipCode || '' },
          features: { bedrooms: d.rooms || 0, bathrooms: d.baths || 0, area: d.area || 0 },
          images: d.images?.length > 0 ? d.images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000'],
          isSponsored: true,
          promoType: 'gold'
        };
      })
      .slice(0, 1); // Only 1 sponsored ad

    // Final balance: 1 Sponsored + 2 Seller = 3 total
    relatedAds = [...sponsoredProperties, ...sellerProperties];

  } catch(e) {
    console.error("Error get related properties:", e);
  }

  const formattedDate = property.createdAt 
    ? new Date(property.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) 
    : 'Recientemente';

  return (
    <div 
      className="bg-[#f4f4f4] min-h-screen pt-[72px]"
      style={{ 
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 11 50 11c-10.639 0-16.035 2.333-25.753 5.928H0v3h21.184zM0 16.5c2.493-.726 5.12-1.688 8.214-2.922C16.88 10.457 21.6 8 30 8c8.397 0 13.12 2.457 21.786 5.578C54.88 14.812 57.507 15.773 60 16.5h40V0H0v16.5z' fill='%23000000' fill-opacity='0.025' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        backgroundSize: "80px 16px"
      }}
    >
      <div className="bg-white w-full border-b border-gray-200 pb-12 pt-4">
      <div className="container mx-auto px-6">
        
        {/* Breadcrumbs & Top Actions */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
            <Link href="/" className="hover:text-[#139E69] transition-colors">imoob</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <Link href="/propiedades" className="hover:text-[#139E69] transition-colors">Proprietăți</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-400 truncate">{property.title}</span>
          </div>

          <PropertyActionButtons />
        </div>

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 mb-0">
          
          {/* LEFT COLUMN: Info Panel */}
          <div className="w-full lg:w-[540px] xl:w-[620px] shrink-0 order-2 lg:order-1 flex flex-col pt-6 lg:pt-8 px-6 lg:px-8 pb-6 lg:pb-8 rounded-3xl" style={{ backgroundColor: "#F8FAF7" }}>
            <h1 className="text-[28px] lg:text-[34px] font-black text-[#1a1a1a] leading-[1.15] tracking-tight mb-4 capitalize">
              {propertyTypeLabel} {property.operation === 'inchiriere' ? 'de închiriat' : 'de vânzare'} în {property.location.localitate || property.location.city}
            </h1>
            
            <div className="flex items-center gap-2 text-gray-500 mb-5">
              <MapPin size={18} strokeWidth={2} />
              <span className="text-[15px]">{(() => {
                if (property.location.hideExactAddress) {
                  return [property.location.localitate, property.location.judet ? `Județul ${property.location.judet}` : ''].filter(Boolean).join(', ');
                }
                const parts = [];
                if (property.location.strada) parts.push(property.location.strada);
                if (property.location.numar) parts.push(`nr. ${property.location.numar}`);
                if (property.location.bloc) parts.push(`bl. ${property.location.bloc}`);
                
                const addressStr = parts.join(', ');
                return [addressStr, property.location.localitate].filter(Boolean).join(', ') || 'Locație necunoscută';
              })()}</span>
            </div>
            
            <div className="flex items-center text-[13px] text-gray-500 mb-8 font-medium">
              <span>ID # {property.id.substring(0, 8).toUpperCase()}</span>
              <span className="mx-3 text-gray-300">|</span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <Calendar size={14} className="text-gray-400" />
                Publicado el {formattedDate}
              </span>
              <span className="mx-3 text-gray-300">|</span>
              <span className="flex items-center gap-1.5 text-orange-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                {property.views} personas están viendo esta propiedad
              </span>
            </div>

            <hr className="w-full border-t border-gray-200/80 mb-8" />

            <div className="mb-8">
              <h2 className="text-[32px] font-black text-[#1a1a1a] tracking-tight">Precio {formattedPrice}</h2>
              {property.pretNegociabil && <p className="text-[14px] text-[#139E69] font-medium mt-1.5 flex items-center gap-1.5"><CheckCircle2 size={14} /> Preț negociabil</p>}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 mb-10">
              {Number(property.features?.bedrooms) > 0 && (
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Bed size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">{property.features.bedrooms} {Number(property.features.bedrooms) === 1 ? 'habitación' : 'habitaciones'}</span>
                </div>
              )}
              {Number(property.features?.bathrooms) > 0 && (
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Bath size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">{property.features.bathrooms} {Number(property.features.bathrooms) === 1 ? 'baño' : 'baños'}</span>
                </div>
              )}
              {(Number((property.features as any)?.garage) > 0 || Number((property.features as any)?.parking) > 0 || property.amenities?.some(a => a.toLowerCase().includes('parcare') || a.toLowerCase().includes('garaj') || a.toLowerCase().includes('garage') || a.toLowerCase().includes('parking'))) && (
                <div className="flex items-center gap-2.5 text-gray-500">
                  <ParkingSquare size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">
                    {Number((property.features as any)?.garage || (property.features as any)?.parking) > 0 
                      ? `${(property.features as any)?.garage || (property.features as any)?.parking} ${Number((property.features as any)?.garage || (property.features as any)?.parking) === 1 ? 'parqueo' : 'parqueos'}` 
                      : 'Garaje / Parqueo'}
                  </span>
                </div>
              )}
              {Number(property.features?.area) > 0 && (
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Square size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">{property.features.area} m²</span>
                </div>
              )}
              {property.location?.etaj && (
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Layers3 size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">Etaj {property.location.etaj}</span>
                </div>
              )}
              {property.amenities?.some(a => a.toLowerCase().includes('mobilat') || a.toLowerCase().includes('amuebla')) && (
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Box size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">Amueblado</span>
                </div>
              )}

            </div>

            <div className="flex items-center gap-4 mt-auto">
              <a 
                href={`tel:${property.agent.phone}`}
                className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white text-[15px] font-bold py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center text-center"
              >
                Apelează agentul
              </a>
              <a 
                href={`https://wa.me/${property.agent.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-black hover:bg-stone-800 text-white text-[15px] font-bold py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center text-center relative"
              >
                Chat WhatsApp
                <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#f97316] rounded-full border-2 border-white shadow-sm"></div>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Gallery */}
          <div className="w-full flex-1 order-1 lg:order-2">
            <PropertyGallery 
              images={property.images} 
              title={property.title} 
              agent={property.agent}
              propertyInfo={{
                price: `${(property as any).currency === 'USD' ? 'U$S' : '€'} ${property.price.toLocaleString('ro-RO')}`,
                size: `${(property as any).surface_util} m²`,
                location: `${property.location.localitate}, ${property.location.judet}`
              }}
            />
          </div>
        </div>
      </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start mt-0">
          <div>
            {/* Main Content */}
            <div className="space-y-3">




            {/* ═══════════════════════════════════════════════════════════ */}
            {/* CARACTERISTICI — Elegant photo-matching UI                  */}
            {/* ═══════════════════════════════════════════════════════════ */}
            {(() => {
              const techItems = [
                { label: 'Nr. camere:', value: property.features.bedrooms || '1' },
                { label: 'Tip imobil:', value: property.techDetails.tipImobil || (property.type === 'camera' ? 'Apartament' : property.type) || 'Nespecificat' },
                { label: 'Suprafata utila:', value: property.features.area ? `${property.features.area} mp` : null },
                { label: 'Regim inaltime:', value: property.techDetails.nrNiveluri ? `P+${property.techDetails.nrNiveluri}` : 'Nespecificat' },
                { label: 'Etaj:', value: property.location.etaj || (property.features.floors ? `${property.features.floors}` : 'Nespecificat') },
                { label: 'Nr. bai:', value: property.features.bathrooms || '1' },
                { label: 'Compartimentare:', value: property.techDetails.compartimentare || 'Nespecificat' },
                { label: 'S. construita:', value: property.techDetails.suprafataTeren ? `${property.techDetails.suprafataTeren} mp` : null },
                { label: 'An constructie:', value: property.techDetails.yearBuilt },
                { label: 'Certificat energetic:', value: property.techDetails.energyCertificate },
              ].filter(item => item.value);

              if (techItems.length === 0) return null;

              return (
                <div className="mb-12 bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-8 pt-8 pb-6 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-baseline gap-4">
                      <h2 className="text-[22px] font-black text-gray-900 tracking-tight">Caracteristici</h2>
                      <span className="text-sm text-gray-400 font-medium hidden sm:block">Detalii tehnice esențiale</span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                      {techItems.map((item, idx) => {
                        const isDesktopGray = Math.floor(idx / 2) % 2 === 0;
                        const isMobileGray = idx % 2 === 0;

                        return (
                          <div 
                            key={idx} 
                            className={`flex items-center justify-between py-3.5 px-5 rounded-3xl transition-colors ${
                              isDesktopGray ? 'md:bg-[#f9fafb]' : 'md:bg-transparent'
                            } ${
                              isMobileGray ? 'bg-[#f9fafb]' : 'bg-transparent'
                            }`}
                          >
                            <span className="text-[15px] text-gray-600 font-normal">{item.label}</span>
                            <span className="text-[15px] font-bold text-gray-900 capitalize">{item.value}</span>
                          </div>
                        );
                      })}
                    </div>

                    {techItems.length > 8 && (
                      <div className="mt-8">
                        <button className="px-6 py-2.5 border border-[#fbbf24] text-gray-800 text-[14.5px] font-medium rounded-xl hover:bg-[#fffbeb] transition-colors">
                          Mai multe caracteristici
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Description Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-8 pt-8 pb-5 bg-gray-50/80">
                <div className="flex items-baseline gap-4">
                  <h2 className="text-2xl font-bold text-[#333] tracking-tight">Descriere</h2>
                  <p className="text-sm text-gray-400 font-medium">Detalii despre proprietate</p>
                </div>
                <div className="mt-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              </div>
              <div className="px-8 py-6">
                <div className="text-[15px] text-gray-600 leading-[1.85] whitespace-pre-line font-[420] tracking-[0.01em]">
                  {property.longDescription}
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* ROOMMATE FINDER — Dedicated Section for Shared Rooms          */}
            {/* ═══════════════════════════════════════════════════════════ */}
            {property.type === 'camera' && property.roommateDetails?.cautaColeg && (
              <div className="bg-emerald-50/50 rounded-3xl shadow-sm border border-emerald-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-[0.03]">
                  <Users size={120} />
                </div>
                {/* Ultra-clean Header */}
                <div className="px-8 pt-8 pb-6 border-b border-emerald-100/60 flex flex-wrap items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm">
                      <Users size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-[22px] font-black text-emerald-950 tracking-tight leading-none mb-1">Informații Coleg de Apartament</h2>
                      <span className="text-sm text-emerald-700/80 font-medium hidden md:block">Detalii despre locatari și preferințe</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/50 px-3 py-1.5 border border-emerald-200/50 rounded-full">
                    Gata de mutare
                  </span>
                </div>

                {/* Content */}
                <div className="px-8 py-8 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Persoane actuale */}
                    <div className="bg-white rounded-2xl p-6 border border-emerald-100/80 shadow-[0_4px_20px_-10px_rgba(16,185,129,0.15)] flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-4">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                             <Home size={16} className="text-slate-500" />
                           </div>
                           <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">În prezent locuiesc</h3>
                         </div>
                      </div>
                      <div className="mt-auto flex items-baseline gap-2">
                        <span className="text-[32px] font-black text-emerald-950 leading-none">{property.roommateDetails.nrPersoaneActual || 1}</span>
                        <span className="text-[15px] font-bold text-emerald-800">persoane</span>
                      </div>
                    </div>
                    
                    {/* Preferințe */}
                    <div className="bg-white rounded-2xl p-6 border border-emerald-100/80 shadow-[0_4px_20px_-10px_rgba(16,185,129,0.15)] flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-4">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-[#139E69]/10 flex items-center justify-center border border-[#139E69]/20">
                             <Heart size={16} className="text-[#139E69]" fill="currentColor" />
                           </div>
                           <h3 className="text-[13px] font-bold text-emerald-600/70 uppercase tracking-wider">Profil preferat</h3>
                         </div>
                      </div>
                      <div className="mt-auto">
                        <span className="text-[20px] font-bold text-emerald-950 capitalize leading-tight">
                          {property.roommateDetails.preferinteColeg || 'Oricine este binevenit'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    {/* Facturi */}
                    <div className="bg-white rounded-2xl p-4 border border-emerald-100/50 flex flex-col items-center justify-center text-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                         <Zap size={14} className="text-orange-500" />
                       </div>
                       <div>
                         <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Facturi</span>
                         <span className="block text-[13px] font-bold text-gray-800">{property.roommateDetails.cheltuieliIncluse === 'da' ? 'Incluse' : 'Separat'}</span>
                       </div>
                    </div>
                    {/* Frigider */}
                    <div className="bg-white rounded-2xl p-4 border border-emerald-100/50 flex flex-col items-center justify-center text-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                         <Snowflake size={14} className="text-blue-500" />
                       </div>
                       <div>
                         <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Frigider</span>
                         <span className="block text-[13px] font-bold text-gray-800 capitalize">{property.roommateDetails.frigiderPersonal}</span>
                       </div>
                    </div>
                    {/* Cheie */}
                    <div className="bg-white rounded-2xl p-4 border border-emerald-100/50 flex flex-col items-center justify-center text-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center">
                         <Key size={14} className="text-stone-500" />
                       </div>
                       <div>
                         <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Yală</span>
                         <span className="block text-[13px] font-bold text-gray-800">{property.roommateDetails.cameraCuCheie === 'da' ? 'Cameră sigură' : 'Nu are'}</span>
                       </div>
                    </div>
                    {/* Animale */}
                    <div className="bg-white rounded-2xl p-4 border border-emerald-100/50 flex flex-col items-center justify-center text-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
                         <Dog size={14} className="text-yellow-600" />
                       </div>
                       <div>
                         <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Animale</span>
                         <span className="block text-[13px] font-bold text-gray-800">{property.roommateDetails.animaleAceptate === 'nu' ? 'Nu' : (property.roommateDetails.animaleAceptate === 'da' ? 'Acceptate' : 'Talie mică')}</span>
                       </div>
                    </div>
                    {/* Bucatarie */}
                    <div className="bg-white rounded-2xl p-4 border border-emerald-100/50 flex flex-col items-center justify-center text-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                         <Utensils size={14} className="text-emerald-600" />
                       </div>
                       <div>
                         <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Bucătărie</span>
                         <span className="block text-[13px] font-bold text-gray-800 capitalize">{(property.roommateDetails as any).bucatarie || 'La comun'}</span>
                       </div>
                    </div>
                    {/* Baie */}
                    <div className="bg-white rounded-2xl p-4 border border-emerald-100/50 flex flex-col items-center justify-center text-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                         <Bath size={14} className="text-indigo-600" />
                       </div>
                       <div>
                         <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Baie / Duș</span>
                         <span className="block text-[13px] font-bold text-gray-800 capitalize">{(property.roommateDetails as any).baie || 'La comun'}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <AmenitiesSection propertyAmenities={property.amenities} />
          </div>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 space-y-3">



            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-200">
              <div className="mb-8 flex items-center gap-4">
                <AgentAvatar 
                  initialImage={property.agent.image} 
                  name={property.agent.name} 
                />
                <div>
                  <h3 className="font-bold text-gray-900 text-[17px] tracking-tight">{property.agent.name}</h3>
                  <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">{property.agent.role}</p>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="font-bold text-gray-900 text-[15px] mb-3 border-b border-gray-100 pb-2">Solicită informații sau vizită</h4>
                
                <ContactForm />

                <SecondaryActions />
                

              </div>
            </div>

            {/* Notification Block */}
            <NotificationCard />
          </div>
        </div>

        {relatedAds.length > 0 && (
          <div className="mt-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-[#139E69] mb-2">
                  Mai multe de la vânzător
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  Mai multe anunțuri de la {property.agent.name}
                </h2>
              </div>
              <Link
                href="/propiedades"
                className="text-sm font-bold text-[#139E69] hover:underline"
              >
                Vezi toate
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {relatedAds.map((ad) => {
                const adFormattedPrice = new Intl.NumberFormat('ro-RO', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                }).format(ad.price);

                return (
                  <Link
                    key={ad.id}
                    href={`/propiedades/${ad.slug}`}
                    className={`group flex overflow-hidden rounded-[24px] border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      ad.isSponsored 
                        ? 'border-amber-200 shadow-amber-500/5 ring-1 ring-amber-500/10' 
                        : 'border-gray-100 hover:border-[#139E69]/30 hover:shadow-emerald-500/5'
                    }`}
                  >
                    <div className="flex h-full w-full relative">
                      {/* Image Container with its own clipping */}
                      <div className="relative w-[130px] min-w-[130px] bg-gray-50 flex-shrink-0">
                        <div className="absolute inset-0 overflow-hidden">
                          <Image
                            src={ad.images[0]}
                            alt={ad.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                        
                        {/* Sponsored Badge - Outside Image overflow but inside Relative Card */}
                        {ad.isSponsored && (
                          <div className="absolute bottom-3 left-3 z-20 scale-90 origin-left">
                            <div className="group/tooltip relative">
                              <span className="bg-black/70 backdrop-blur-md text-[#f25c1a] px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-[#f25c1a]/40 flex items-center gap-2 shadow-lg cursor-help transition-all hover:bg-black/80">
                                <Info size={12} className="text-white/90" /> PROMOVAT
                              </span>
                              
                              {/* Floating Elegant Tooltip */}
                              <div className="absolute bottom-full left-0 mb-3 w-56 p-3 bg-gray-900/95 backdrop-blur-xl text-white text-[11px] font-medium leading-normal rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible group-hover/tooltip:translate-y-[-4px] transition-all duration-300 pointer-events-none z-[100] normal-case tracking-normal border border-white/10">
                                <p className="relative z-10">
                                  Recomandare <span className="text-[#f25c1a] font-bold">IMOOB</span>. Imobil de la un utilizator extern.
                                </p>
                                {/* Glow effect inside tooltip */}
                                <div className="absolute top-0 right-0 w-12 h-12 bg-[#f25c1a]/10 blur-xl rounded-full"></div>
                                {/* Tooltip Arrow */}
                                <div className="absolute top-full left-4 -mt-1 w-3 h-3 bg-gray-900/95 border-r border-b border-white/10 rotate-45"></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="inline-block px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-[#139E69] bg-[#EAF5EE] rounded-md">
                              {ad.status === 'for-sale' ? 'De vânzare' : 'Închiriere'}
                            </span>
                          </div>
                          <h3 className="mt-2.5 line-clamp-2 text-[13px] font-bold leading-tight text-gray-800 group-hover:text-[#f25c1a] transition-colors">
                            {ad.title}
                          </h3>
                          <p className="mt-1 text-[11px] text-gray-400 font-medium truncate">
                            {ad.location.city}
                          </p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                          <div className="text-lg font-black text-[#139E69] tracking-tighter">{adFormattedPrice}</div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            <span>{ad.features.bedrooms} cam.</span>
                            <span>{ad.features.area} m²</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
