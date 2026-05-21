'use client';

import { User, Mail, Phone, Shield, Bell, Globe, Trash2, Camera, Save, CheckCircle2, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const InputField = ({ label, type = "text", placeholder, icon: Icon, value, onChange }: any) => (
  <div className="flex flex-col gap-2 w-full text-left">
    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#f25c1a] transition-colors">
        <Icon size={18} strokeWidth={2} />
      </div>
      <input 
        type={type} 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500/20 focus:bg-white px-14 py-4 rounded-[22px] text-[15px] font-bold text-gray-800 transition-all outline-none placeholder:text-gray-300"
      />
    </div>
  </div>
);

const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-14 h-8 rounded-full relative transition-all duration-300 ${active ? 'bg-[#f25c1a]' : 'bg-gray-200'}`}
  >
    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${active ? 'left-7' : 'left-1'}`}></div>
  </button>
);

export default function SettingsPage() {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    offers: true,
    priceDrops: true
  });

  const [logo, setLogo] = useState<string | null>(null);

  // Load logo and user profile details
  useEffect(() => {
    const savedLogo = localStorage.getItem('imoob_user_logo');
    if (savedLogo) setLogo(savedLogo);

    if (user) {
      const fetchProfile = async () => {
        try {
          const userSnap = await getDoc(doc(db, 'users', user.uid));
          if (userSnap.exists()) {
            const data = userSnap.data();
            setProfile({
              name: data.name || user.displayName || '',
              email: data.email || user.email || '',
              phone: data.phone || '',
              location: data.location || ''
            });
          } else {
            setProfile({
              name: user.displayName || '',
              email: user.email || '',
              phone: '',
              location: ''
            });
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogo(base64);
        localStorage.setItem('imoob_user_logo', base64);
        // Trigger a custom event so other components know the logo changed
        window.dispatchEvent(new CustomEvent('user-logo-changed', { detail: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      const payload: any = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        location: profile.location
      };
      
      if (!userSnap.exists() || !userSnap.data().createdAt) {
        payload.createdAt = new Date();
      }
      
      await setDoc(userRef, payload, { merge: true });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Error al guardar los cambios.");
    }
  };

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };



  return (
    <div className="flex flex-col gap-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Profile Identity Card */}
      <section className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
          <div className="relative group cursor-pointer" onClick={() => document.getElementById('logo-upload')?.click()}>
            <div className="w-32 h-32 rounded-[40px] bg-orange-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
              {logo ? (
                <img src={logo} alt="Profile Logo" className="w-full h-full object-cover" />
              ) : (
                <User size={60} className="text-[#f25c1a]" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#f25c1a] text-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <Camera size={20} />
            </div>
            <input 
              id="logo-upload"
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleLogoUpload}
            />
          </div>
          
          <div className="flex-1 flex flex-col gap-8 w-full">
            {isLoading ? (
              <div className="h-40 flex items-center justify-center text-gray-400">
                <Loader2 className="animate-spin mr-2" /> Căutăm datele profilului...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Nume Complet" icon={User} value={profile.name} onChange={(e: any) => setProfile({ ...profile, name: e.target.value })} placeholder="Introduceți numele complet" />
                  <InputField label="Adresă Email" icon={Mail} value={profile.email} onChange={(e: any) => setProfile({ ...profile, email: e.target.value })} placeholder="Introduceți adresa de email" />
                  <InputField label="Număr Telefon" icon={Phone} value={profile.phone} onChange={(e: any) => setProfile({ ...profile, phone: e.target.value })} placeholder="Introduceți numărul de telefon" />
                  <InputField label="Locație" icon={Globe} value={profile.location} onChange={(e: any) => setProfile({ ...profile, location: e.target.value })} placeholder="Introduceți localitatea" />
                </div>
                
                <button 
                  onClick={handleSave}
                  className="w-fit bg-[#f25c1a] hover:bg-[#ff6b00] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95 flex items-center gap-3"
                >
                  {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                  {isSaved ? 'Modificări Salvate' : 'Salvează Profilul'}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Security Section */}
        <section className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)]">
          <h3 className="text-[20px] font-bold text-gray-800 flex items-center gap-3 mb-10 text-left">
            <Shield size={22} className="text-[#f25c1a]" />
            Securitate Cont
          </h3>
          <div className="flex flex-col gap-6">
            <InputField label="Parolă Curentă" type="password" icon={Shield} placeholder="••••••••" />
            <InputField label="Parolă Nouă" type="password" icon={Shield} placeholder="Introduceți noua parolă" />
            
            <div className="mt-4 p-6 bg-blue-50/50 rounded-[30px] border border-blue-100/50 flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <AlertCircle size={18} className="text-blue-500" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[13px] font-bold text-gray-800">Autentificare în doi pași (2FA)</div>
                <div className="text-[11px] text-gray-500 font-medium mb-4">Adăugați un strat extra de securitate contului dvs.</div>
                <button className="text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">
                  Activează acum →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)]">
          <h3 className="text-[20px] font-bold text-gray-800 flex items-center gap-3 mb-10 text-left">
            <Bell size={22} className="text-[#f25c1a]" />
            Notificări și Alerte
          </h3>
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between group">
              <div className="text-left">
                <div className="text-[15px] font-bold text-gray-800 transition-colors group-hover:text-[#f25c1a]">Alerte Email</div>
                <div className="text-[12px] text-gray-400 font-medium">Primește notificări despre activitatea contului pe email.</div>
              </div>
              <Toggle active={notifications.email} onClick={() => toggleNotif('email')} />
            </div>
            
            <div className="flex items-center justify-between group">
              <div className="text-left">
                <div className="text-[15px] font-bold text-gray-800 transition-colors group-hover:text-[#f25c1a]">Mesaje SMS</div>
                <div className="text-[12px] text-gray-400 font-medium">Notificări critice direct pe telefonul tău.</div>
              </div>
              <Toggle active={notifications.sms} onClick={() => toggleNotif('sms')} />
            </div>

            <div className="flex items-center justify-between group">
              <div className="text-left">
                <div className="text-[15px] font-bold text-gray-800 transition-colors group-hover:text-[#f25c1a]">Oferte Exclusive</div>
                <div className="text-[12px] text-gray-400 font-medium">Anunțuri relevante și oferte personalizate.</div>
              </div>
              <Toggle active={notifications.offers} onClick={() => toggleNotif('offers')} />
            </div>

            <div className="flex items-center justify-between group">
              <div className="text-left">
                <div className="text-[15px] font-bold text-gray-800 transition-colors group-hover:text-[#f25c1a]">Scăderi de Preț</div>
                <div className="text-[12px] text-gray-400 font-medium">Află imediat când un anunț favorit se ieftinește.</div>
              </div>
              <Toggle active={notifications.priceDrops} onClick={() => toggleNotif('priceDrops')} />
            </div>
          </div>
        </section>
      </div>

      {/* Danger Zone */}
      <section className="bg-white rounded-[40px] p-10 border border-red-50 shadow-[0_15px_60px_-15px_rgba(239,68,68,0.05)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-[20px] font-bold text-red-500 flex items-center gap-3 justify-center md:justify-start mb-2">
              <Trash2 size={22} />
              Zonă Periculoasă
            </h3>
            <p className="text-gray-400 font-medium text-[14px]">
              Odată ce contul este șters, toate datele tale vor fi eliminate definitiv. Această acțiune nu poate fi anulată.
            </p>
          </div>
          <button className="px-10 py-4 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-red-100 hover:border-red-500">
            Șterge Contul Definitiv
          </button>
        </div>
      </section>

    </div>
  );
}
