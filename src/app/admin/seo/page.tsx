'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Save, Loader2, Globe, Search, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminSEOPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Vindu24 | Anunțuri Imobiliare și Auto',
    titleTemplate: '%s | Vindu24',
    description: 'Platforma ta de încredere pentru imobiliare și auto. Găsește proprietatea sau mașina de vis pe Vindu24.',
    keywords: 'imobiliare, auto, apartamente, case, masini, vanzari, inchirieri, vindu24, romania',
    ogImage: 'https://vindu24.ro/og-image.jpg',
    siteName: 'Vindu24',
    author: 'Vindu24 Team',
    themeColor: '#139E69'
  });

  useEffect(() => {
    if (!user) return;
    const fetchSEO = async () => {
      try {
        const docRef = doc(db, 'settings', 'seo');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (err) {
        console.error('Error fetching SEO settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSEO();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'seo'), {
        ...formData,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid
      });
      alert('Setări SEO salvate cu succes!');
    } catch (err) {
      console.error('Error saving SEO settings:', err);
      alert('A apărut o eroare la salvarea setărilor.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Globe className="text-sky-500" />
          Setări Globale SEO
        </h1>
        <p className="text-gray-500 text-sm mt-1">Gestionează metadatele, descrierile și imaginea socială pentru ca site-ul să fie indexat perfect în Google.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
        
        {/* Basic Meta Settings */}
        <section className="space-y-5">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Search className="w-5 h-5 text-gray-400" />
            Metadate Principale
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titlu Default Site (Default Title)</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-medium"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Ex: Vindu24 | Anunțuri Imobiliare și Auto</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Format Titlu (Title Template)</label>
              <input
                type="text"
                name="titleTemplate"
                value={formData.titleTemplate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-medium"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Folosește %s pentru pagina curentă (Ex: %s | Vindu24)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descriere SEO (Meta Description)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-medium resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Ideal între 150 și 160 de caractere. Rezumat atrăgător pentru Google.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cuvinte cheie (Keywords)</label>
            <textarea
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-medium resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">Separate prin virgulă (Ex: imobiliare, auto, vânzări)</p>
          </div>
        </section>

        {/* Social Media OpenGraph */}
        <section className="space-y-5">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
            <ImageIcon className="w-5 h-5 text-gray-400" />
            Social Media & OpenGraph (Facebook/Twitter)
          </h2>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Imagine OpenGraph (URL)</label>
            <div className="flex gap-4 items-center">
              <input
                type="url"
                name="ogImage"
                value={formData.ogImage}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-medium"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Aceasta este imaginea care apare atunci când trimiți link-ul pe WhatsApp, Facebook, etc.</p>
            
            {formData.ogImage && (
              <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 max-w-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.ogImage} alt="OpenGraph Preview" className="w-full h-auto object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nume Site (Site Name)</label>
              <input
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Autor</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Theme Color (HEX)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  name="themeColor"
                  value={formData.themeColor}
                  onChange={handleChange}
                  className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  name="themeColor"
                  value={formData.themeColor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-medium"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Se salvează...' : 'Salvează Setările SEO'}
          </button>
        </div>
      </form>
    </div>
  );
}
