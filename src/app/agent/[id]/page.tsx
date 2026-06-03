'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, MapPin, Building2, CalendarDays, MessageSquareText, ThumbsUp, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/properties/PropertyCard';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useParams } from 'next/navigation';

export default function AgentProfilePage() {
  const params = useParams();
  const agentId = params.id as string;
  
  const [agent, setAgent] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock Reviews Data para el diseño
  const mockReviews = [
    {
      id: 1,
      user: 'Maria Popescu',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
      rating: 5,
      date: 'Acum 2 săptămâni',
      text: 'Foarte profesionist și amabil! M-a ajutat să găsesc apartamentul perfect în timp record. Recomand cu mare încredere!'
    },
    {
      id: 2,
      user: 'Andrei Vasile',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150',
      rating: 5,
      date: 'Acum o lună',
      text: 'O experiență excelentă. Comunicare rapidă, transparentă și o atitudine orientată spre soluții.'
    },
    {
      id: 3,
      user: 'Elena D.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
      rating: 4,
      date: 'Acum 2 luni',
      text: 'Agent foarte bine pregătit, cunoaște bine piața din zonă. A durat puțin mai mult decât mă așteptam, dar rezultatul a fost foarte bun.'
    }
  ];

  useEffect(() => {
    const fetchAgentAndProperties = async () => {
      if (!agentId) return;
      setLoading(true);
      
      try {
        // Fetch Agent Details (We use a mock structure if not found in db directly)
        // Usually agents might be users or saved in 'agents' collection. Let's try users first
        const userDoc = await getDoc(doc(db, 'users', agentId));
        let agentData = {
          id: agentId,
          name: 'Alex',
          role: 'PROPRIETAR PARTICULAR',
          image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
          joinedDate: 'Membru din 2024',
          totalListings: 0,
          rating: 4.8,
          reviewsCount: 12
        };

        if (userDoc.exists()) {
          const d = userDoc.data();
          agentData = {
            ...agentData,
            name: d.displayName || d.name || 'Proprietar Anonim',
            role: d.role === 'agent' ? 'AGENT IMOBILIAR' : 'PROPRIETAR PARTICULAR',
            image: d.photoURL || d.image || agentData.image,
          };
        }

        // Fetch Properties for this agent
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#139E69]"></div>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 font-bold text-xl">Profilul nu a fost găsit.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />
      
      {/* Profile Header Background Banner */}
      <div className="h-48 md:h-64 bg-slate-900 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-slate-900 opacity-90"></div>
        {/* Subtle pattern or texture could go here */}
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-20">
        
        {/* Profile Card */}
        <div className="bg-white rounded-[24px] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          
          {/* Avatar with Green Ring */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[4px] border-[#139E69] overflow-hidden bg-white shadow-lg p-1">
              <div className="w-full h-full rounded-full overflow-hidden relative">
                <Image src={agent.image} fill className="object-cover" alt={agent.name} />
              </div>
            </div>
            {/* Verified Badge */}
            <div className="absolute bottom-2 right-2 bg-[#139E69] text-white p-1.5 rounded-full border-4 border-white shadow-sm" title="Cont Verificat">
              <ShieldCheck size={18} />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left mt-2 md:mt-6">
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-1">{agent.name}</h1>
            <p className="text-[#139E69] font-bold text-sm tracking-[0.1em] uppercase mb-4">{agent.role}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 text-slate-500 font-medium text-sm">
              <div className="flex items-center gap-1.5">
                <Building2 size={16} />
                <span>{agent.totalListings} Anunțuri Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays size={16} />
                <span>{agent.joinedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-slate-700 font-bold">{agent.rating}</span>
                <span>({agent.reviewsCount} Recenzii)</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="shrink-0 flex flex-col gap-3 mt-4 md:mt-8 w-full md:w-auto">
            <button className="bg-slate-900 hover:bg-[#A13A17] text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md active:scale-95 text-[15px] flex items-center justify-center gap-2">
              <MessageSquareText size={18} />
              Trimite Mesaj
            </button>
            <button className="bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-8 py-3.5 rounded-xl font-bold transition-all text-[15px] flex items-center justify-center gap-2">
              <ThumbsUp size={18} />
              Recomandă
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content (Properties) */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Anunțurile lui {agent.name.split(' ')[0]}</h2>
            
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map(prop => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 size={24} className="text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">Acest utilizator nu are anunțuri active momentan.</p>
              </div>
            )}
          </div>

          {/* Sidebar (Reviews) */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Recenzii & Rating</h2>
            
            <div className="bg-white rounded-[24px] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-6 flex flex-col gap-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                <div className="text-5xl font-black text-slate-800">{agent.rating}</div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-400 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={16} fill={i <= Math.floor(agent.rating) ? "currentColor" : "transparent"} className={i <= Math.floor(agent.rating) ? "" : "text-gray-300"} />
                    ))}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">Din {agent.reviewsCount} păreri reale</div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="flex flex-col gap-5">
                {mockReviews.map(review => (
                  <div key={review.id} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                        <Image src={review.avatar} width={40} height={40} className="object-cover w-full h-full" alt={review.user} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-700 text-[13px] truncate">{review.user}</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "transparent"} strokeWidth={i < review.rating ? 0 : 2} className={i < review.rating ? "" : "text-gray-300"} />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed font-medium">"{review.text}"</p>
                  </div>
                ))}
              </div>
              
              <button className="w-full py-3 mt-2 text-[#139E69] font-bold text-sm bg-[#139E69]/10 hover:bg-[#139E69]/20 rounded-xl transition-colors">
                Vezi toate recenziile
              </button>

            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
