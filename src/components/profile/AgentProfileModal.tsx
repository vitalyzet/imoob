'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Star, MapPin, Building2, CalendarDays, ShieldCheck, X, Heart, Box, Check, ChevronDown } from 'lucide-react';
import PropertyCard from '@/components/properties/PropertyCard';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

type Tab = 'published' | 'reviews' | 'info';

export default function AgentProfileModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const agentId = searchParams.get('agentProfile');
  
  const [activeTab, setActiveTab] = useState<Tab>('published');
  const [agent, setAgent] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const mockReviews = [
    {
      id: 1,
      user: 'Maria Popescu',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
      rating: 5,
      date: 'Acum 2 săptămâni',
      text: 'Foarte profesionist și amabil! M-a ajutat să găsesc apartamentul perfect în timp record. Recomand cu mare încredere!',
      tag: 'A închiriat: Apartament 2 camere'
    },
    {
      id: 2,
      user: 'Andrei Vasile',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150',
      rating: 5,
      date: 'Acum o lună',
      text: 'O experiență excelentă. Comunicare rapidă, transparentă și o atitudine orientată spre soluții.',
      tag: 'A cumpărat: Garsonieră'
    },
    {
      id: 3,
      user: 'Elena D.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
      rating: 4,
      date: 'Acum 2 luni',
      text: 'Agent foarte bine pregătit, cunoaște bine piața din zonă. A durat puțin mai mult decât mă așteptam, dar rezultatul a fost foarte bun.',
      tag: 'A cumpărat: Casă / Vilă'
    }
  ];

  useEffect(() => {
    if (!agentId) {
      setActiveTab('published');
      return;
    }

    const fetchAgentAndProperties = async () => {
      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', agentId));
        let agentData = {
          id: agentId,
          name: 'Alex',
          role: 'PROPRIETAR PARTICULAR',
          image: '',
          joinedDate: '2024',
          totalListings: 0,
          rating: 5.0,
          reviewsCount: 36,
          sales: 34,
          purchases: 25,
          location: 'București, România'
        };

        if (userDoc.exists()) {
          const d = userDoc.data();
          agentData = {
            ...agentData,
            name: d.displayName || d.name || 'Proprietar Anonim',
            role: d.role === 'agent' ? 'AGENT IMOBILIAR' : 'PROPRIETAR PARTICULAR',
            image: d.photoURL || d.image || d.photo || '',
          };
        }

        const q = query(collection(db, 'anuncios'), where('userId', '==', agentId));
        const snapshots = await getDocs(q);
        
        const mapped = snapshots.docs.map(document => {
          const d = document.data();
          let status = (d.operation === 'vender' || d.operation === 'vanzare') ? 'for-sale' : 'for-rent';
          if (d.type === 'camera') status = 'for-rent';
          
          return {
            id: document.id,
            title: d.title || 'Proprietate',
            slug: document.id,
            description: d.description || '',
            price: Number(d.price) || 0,
            oldPrice: d.oldPrice ? Number(d.oldPrice) : null,
            currency: 'EUR',
            type: d.type || 'apartment',
            status: status,
            location: {
              address: d.address || '',
              city: d.localitate || d.city || d.judet || '',
              state: d.judet || '',
              country: 'România',
              zipCode: d.zipCode || '',
            },
            features: {
              bedrooms: parseInt(d.rooms) || parseInt(d.bedrooms) || 0,
              bathrooms: parseInt(d.baths) || parseInt(d.bai) || parseInt(d.bathrooms) || 0,
              area: parseFloat(d.area) || parseFloat(d.suprafataUtila) || 0,
            },
            images: d.images?.length > 0 ? d.images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000'],
            agent: {
              id: agentId,
              name: agentData.name,
              role: agentData.role,
              image: agentData.image,
            },
          };
        });

        agentData.totalListings = mapped.length;
        setProperties(mapped);
        setAgent(agentData);
      } catch (err) {
        console.error("Error fetching agent profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentAndProperties();
  }, [agentId]);

  const closeModal = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('agentProfile');
    const queryString = newSearchParams.toString() ? `?${newSearchParams.toString()}` : '';
    router.push(`${pathname}${queryString}`, { scroll: false });
  };

  if (!agentId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-black/40 backdrop-blur-sm">
      
      {/* Modal Container */}
      <div className="relative w-full h-full md:h-auto max-h-screen md:max-h-[95vh] max-w-6xl bg-[#f5f6f7] md:rounded-[20px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 z-50 w-8 h-8 bg-white md:bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center text-slate-600 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="overflow-y-auto overflow-x-hidden flex-1 no-scrollbar flex flex-col">
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#139E69]"></div>
            </div>
          ) : agent ? (
            <>
              {/* Minimal Header */}
              <div className="bg-white px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center bg-slate-100 relative">
                    {agent.image ? (
                      <Image src={agent.image} width={80} height={80} className="object-cover w-full h-full" alt={agent.name} />
                    ) : (
                      <span className="text-3xl font-bold text-slate-400">{agent.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-[22px] font-bold text-slate-800 mb-1 flex items-center gap-2">
                      {agent.name}
                      <ShieldCheck size={18} className="text-[#139E69]" />
                    </h1>
                    <div className="flex items-center gap-2">
                      <div className="flex text-slate-800">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < Math.floor(agent.rating) ? "currentColor" : "transparent"} strokeWidth={i < Math.floor(agent.rating) ? 0 : 2} className={i < Math.floor(agent.rating) ? "" : "text-slate-300"} />
                        ))}
                      </div>
                      <span className="text-[13px] text-slate-700 font-bold">{agent.rating} <span className="text-slate-400 font-normal">({agent.reviewsCount})</span></span>
                    </div>
                  </div>
                </div>

                {/* Right Side Stats */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full md:w-auto text-[13px] text-slate-600 font-medium">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 flex items-center justify-center text-pink-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      </div>
                      <span className="text-slate-800 font-bold">{agent.sales}</span> Vânzări
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-slate-800 font-bold">{agent.purchases}</span> Achiziții
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400" />
                      <span>{agent.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-slate-400" />
                      <span>Membru din {agent.joinedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="bg-white border-b border-slate-200 px-6 md:px-12 sticky top-0 z-40 flex items-center justify-between">
                <div className="flex items-center gap-8 md:gap-12 text-[14px] font-bold text-slate-500 overflow-x-auto no-scrollbar">
                  <button 
                    onClick={() => setActiveTab('published')}
                    className={`py-4 md:py-5 border-b-2 transition-colors whitespace-nowrap flex flex-col items-center ${activeTab === 'published' ? 'border-[#139E69] text-slate-800' : 'border-transparent hover:text-slate-700'}`}
                  >
                    <span className="text-[16px] leading-none mb-1">{agent.totalListings}</span>
                    <span className="text-[12px] font-normal">Publicate</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`py-4 md:py-5 border-b-2 transition-colors whitespace-nowrap flex flex-col items-center ${activeTab === 'reviews' ? 'border-[#139E69] text-slate-800' : 'border-transparent hover:text-slate-700'}`}
                  >
                    <span className="text-[16px] leading-none mb-1">{agent.reviewsCount}</span>
                    <span className="text-[12px] font-normal">Recenzii</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('info')}
                    className={`py-4 md:py-5 border-b-2 transition-colors whitespace-nowrap flex flex-col items-center ${activeTab === 'info' ? 'border-[#139E69] text-slate-800' : 'border-transparent hover:text-slate-700'}`}
                  >
                    <span className="text-[16px] leading-none mb-1">+</span>
                    <span className="text-[12px] font-normal">Info</span>
                  </button>
                </div>
                
                <button className="hidden sm:flex items-center gap-1.5 text-[12px] font-bold text-slate-600 hover:text-rose-500 transition-colors">
                  <Heart size={14} />
                  Salvează utilizator
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-6 md:p-12">
                
                {activeTab === 'published' && (
                  <div className="animate-in fade-in duration-300">
                    {properties.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {properties.map(prop => (
                          <div key={prop.id} onClick={closeModal} className="cursor-pointer">
                             <PropertyCard property={prop} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 text-slate-500">
                        Nu are anunțuri publicate momentan.
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
                    {/* Left Column: Rating Breakdown */}
                    <div className="w-full md:w-64 shrink-0 space-y-6">
                      <div className="bg-white rounded-2xl p-5 border border-slate-200">
                        <div className="flex items-center gap-2 font-bold text-slate-800 text-[18px] mb-6">
                          <Star size={20} fill="currentColor" strokeWidth={0} />
                          {agent.rating} <span className="text-slate-400 font-normal text-[14px]">({agent.reviewsCount})</span>
                        </div>
                        
                        <div className="space-y-3">
                          {[
                            { stars: 5, percent: 100 },
                            { stars: 4, percent: 0 },
                            { stars: 3, percent: 0 },
                            { stars: 2, percent: 0 },
                            { stars: 1, percent: 0 },
                          ].map((row) => (
                            <div key={row.stars} className="flex items-center gap-3 text-[12px] font-medium text-slate-500">
                              <span className="w-2">{row.stars}</span>
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-800 rounded-full" style={{ width: `${row.percent}%` }}></div>
                              </div>
                              <span className="w-8 text-right">{row.percent}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-5 border border-slate-200">
                        <h3 className="font-bold text-slate-800 text-[14px] mb-4">Filtre</h3>
                        <div className="space-y-3 text-[13px] text-slate-600">
                           <div className="font-medium mb-1">Rol:</div>
                           <label className="flex items-center gap-2 cursor-pointer">
                             <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#139E69] focus:ring-[#139E69]" />
                             Cumpărător
                           </label>
                           <label className="flex items-center gap-2 cursor-pointer">
                             <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#139E69] focus:ring-[#139E69]" />
                             Vânzător
                           </label>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Reviews List */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8">
                        <div className="flex justify-start mb-8">
                          <button className="flex items-center gap-2 text-[13px] font-bold text-slate-600 border border-slate-300 rounded-full px-4 py-2 hover:bg-slate-50 transition-colors">
                            Sortează: Cele mai noi
                            <ChevronDown size={14} />
                          </button>
                        </div>

                        <div className="space-y-8">
                          {mockReviews.map((review, idx) => (
                            <div key={review.id}>
                              <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-100">
                                  <Image src={review.avatar} width={48} height={48} className="object-cover w-full h-full" alt={review.user} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-2">
                                    <div>
                                      <h4 className="font-bold text-slate-800 text-[15px]">{review.user}</h4>
                                      <span className="text-[12px] text-slate-400">Membru de 3 ani pe Xmobe</span>
                                    </div>
                                    <div className="flex flex-col sm:items-end">
                                      <div className="flex text-slate-800">
                                        {[...Array(5)].map((_, i) => (
                                          <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "transparent"} strokeWidth={i < review.rating ? 0 : 2} className={i < review.rating ? "" : "text-slate-300"} />
                                        ))}
                                      </div>
                                      <span className="text-[11px] text-slate-400 mt-0.5">{review.date}</span>
                                    </div>
                                  </div>
                                  
                                  <p className="text-[14px] text-slate-700 mb-2">{review.text}</p>
                                  <button className="text-[#139E69] text-[12px] font-bold hover:underline mb-3">
                                    Tradu recenzia
                                  </button>

                                  <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
                                    <div className="text-slate-400">
                                      <Box size={16} />
                                    </div>
                                    <div className="text-[12px] text-slate-600 flex-1">
                                      <div className="font-bold">{review.tag}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {idx < mockReviews.length - 1 && <hr className="my-8 border-slate-100" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'info' && (
                  <div className="animate-in fade-in duration-300 max-w-2xl mx-auto">
                    <div className="bg-white rounded-3xl border border-slate-200 p-8">
                      <h2 className="text-[18px] font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Informații Utilizator</h2>
                      <div className="space-y-5">
                        <div className="flex items-center justify-between py-2">
                          <span className="text-slate-500 font-medium text-[14px]">Membru din</span>
                          <span className="text-slate-800 font-bold text-[14px]">{agent.joinedDate}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-slate-500 font-medium text-[14px]">Cont verificat</span>
                          <div className="flex items-center gap-1.5 text-[#139E69] font-bold text-[14px]">
                            <Check size={16} />
                            <span>Da</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-slate-500 font-medium text-[14px]">Tip cont</span>
                          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[12px] font-bold tracking-wide">
                            {agent.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
