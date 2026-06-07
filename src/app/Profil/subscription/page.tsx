'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowLeft, Zap, Crown, Shield, Eye, Image, FileText, RotateCcw, Headphones, Star, ChevronDown } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Standard',
    subtitle: 'Planul tău actual',
    price: 0,
    priceLabel: 'Gratuit',
    description: 'Perfect pentru a începe să folosești platforma.',
    badge: null,
    theme: 'light' as const,
    features: [
      { text: '5 anunțuri / lună', included: true },
      { text: '15 fotografii / anunț', included: true },
      { text: 'Vizibilitate standard', included: true },
      { text: 'Reactivare după expirare', included: true },
      { text: 'Vizibilitate crescută', included: false },
      { text: 'Suport prioritar', included: false },
    ],
    cta: 'Planul tău actual',
    ctaDisabled: true,
  },
  {
    id: 'pro',
    name: 'PRO Particular',
    subtitle: 'Pentru persoane fizice',
    price: 10,
    priceLabel: null,
    description: 'Mai multe anunțuri și expunere dublă față de planul gratuit.',
    badge: 'Recomandat',
    theme: 'green' as const,
    features: [
      { text: '10 anunțuri / lună', included: true },
      { text: '20 fotografii / anunț', included: true },
      { text: '+50% vizibilitate în căutări', included: true, highlight: true },
      { text: 'Reactivare nelimitată', included: true },
      { text: 'Badge PRO pe anunțuri', included: true },
      { text: 'Suport prioritar', included: true },
    ],
    cta: 'Activează PRO Particular',
    ctaDisabled: false,
  },
  {
    id: 'firma',
    name: 'PRO Firmă',
    subtitle: 'Pentru agenții și dealeri',
    price: 30,
    priceLabel: null,
    description: 'Volumul și vizibilitatea maximă pentru afacerea ta.',
    badge: 'Business',
    theme: 'dark' as const,
    features: [
      { text: '30 anunțuri / lună', included: true },
      { text: '35 fotografii / anunț', included: true },
      { text: 'Vizibilitate maximă (+100%)', included: true, highlight: true },
      { text: 'Reactivare nelimitată', included: true },
      { text: 'Pagină publică de firmă', included: true },
      { text: 'Suport dedicat 24/7', included: true },
    ],
    cta: 'Activează PRO Firmă',
    ctaDisabled: false,
  },
];

const faqs = [
  {
    q: 'Pot anula abonamentul oricând?',
    a: 'Da, poți anula abonamentul în orice moment din setările contului tău. Nu există perioadă minimă de contract. Accesul PRO rămâne activ până la finalul perioadei plătite.',
  },
  {
    q: 'Ce se întâmplă cu anunțurile mele dacă anulez?',
    a: 'Anunțurile deja publicate rămân active până la expirare. Pur și simplu nu vei mai putea publica anunțuri noi dincolo de limita gratuită.',
  },
  {
    q: 'Cum funcționează vizibilitatea crescută?',
    a: 'Anunțurile PRO apar cu prioritate în rezultatele de căutare, înaintea anunțurilor gratuite. PRO Firmă beneficiază de poziționare maximă.',
  },
  {
    q: 'Prețurile includ TVA?',
    a: 'Da, toate prețurile afișate includ TVA-ul conform legislației din România.',
  },
];

export default function SubscriptionPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-20">
      
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <Link href="/Profil" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-700 font-medium mb-6 transition-colors text-sm">
          <ArrowLeft size={15} />
          Înapoi la Panou
        </Link>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">
          Alege planul potrivit pentru tine
        </h1>
        <p className="text-gray-500 font-medium text-[15px]">
          Mai multe anunțuri, fotografii și vizibilitate pe Vindu24.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-[28px] p-[1px] transition-all duration-300 ${
              plan.theme === 'green'
                ? 'bg-gradient-to-b from-[#139E69] via-emerald-400 to-[#139E69] shadow-[0_20px_60px_rgba(19,158,105,0.2)] lg:-translate-y-3'
                : plan.theme === 'dark'
                ? 'bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800 shadow-[0_20px_60px_rgba(0,0,0,0.15)]'
                : 'bg-gray-200 shadow-sm'
            }`}
          >
            <div
              className={`rounded-[27px] p-8 flex flex-col h-full relative overflow-hidden ${
                plan.theme === 'dark'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >

              {/* Plan Name */}
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                plan.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {plan.subtitle}
              </p>
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-2xl font-black">{plan.name}</h3>
                {plan.badge && (
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    plan.theme === 'green'
                      ? 'bg-[#139E69]/10 text-[#139E69] border border-[#139E69]/20'
                      : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  }`}>
                    {plan.badge}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-1">
                {plan.priceLabel ? (
                  <span className="text-4xl font-black">{plan.priceLabel}</span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className={`text-xl font-bold ${plan.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>€</span>
                    <span className={`font-medium ml-1 ${plan.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>/ lună</span>
                  </div>
                )}
              </div>
              <p className={`text-sm font-medium mb-8 ${plan.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {plan.description}
              </p>

              {/* Divider */}
              <div className={`w-full h-px mb-6 ${plan.theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}></div>

              {/* Features */}
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className={`flex items-center gap-3 text-[14px] font-medium ${
                    !feature.included
                      ? (plan.theme === 'dark' ? 'text-gray-600' : 'text-gray-300')
                      : feature.highlight
                      ? (plan.theme === 'dark' ? 'text-sky-300 font-bold' : 'text-[#139E69] font-bold')
                      : (plan.theme === 'dark' ? 'text-gray-200' : 'text-gray-700')
                  }`}>
                    {feature.included ? (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        feature.highlight
                          ? (plan.theme === 'dark' ? 'bg-sky-500/20 text-sky-400' : 'bg-[#139E69]/10 text-[#139E69]')
                          : (plan.theme === 'dark' ? 'bg-white/10 text-emerald-400' : 'bg-gray-100 text-[#139E69]')
                      }`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        plan.theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                      }`}>
                        <div className={`w-2 h-[1.5px] rounded ${plan.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                      </div>
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                disabled={plan.ctaDisabled}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-[14px] transition-all duration-200 ${
                  plan.ctaDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : plan.theme === 'green'
                    ? 'bg-[#139E69] text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:scale-[0.98]'
                    : plan.theme === 'dark'
                    ? 'bg-white text-gray-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]'
                    : 'bg-gray-900 text-white hover:-translate-y-0.5 active:scale-[0.98]'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex items-start gap-4">
          <div className="w-11 h-11 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
            <Eye size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Vizibilitate crescută</h4>
            <p className="text-sm text-gray-500 leading-relaxed">Anunțurile PRO apar primele în rezultatele de căutare.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex items-start gap-4">
          <div className="w-11 h-11 bg-violet-50 text-violet-500 rounded-xl flex items-center justify-center shrink-0">
            <Image size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Mai multe fotografii</h4>
            <p className="text-sm text-gray-500 leading-relaxed">Prezintă-ți produsul în detaliu cu galerii mari de imagini.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex items-start gap-4">
          <div className="w-11 h-11 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
            <Shield size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Fără risc</h4>
            <p className="text-sm text-gray-500 leading-relaxed">Anulezi oricând. Fără perioadă minimă, fără taxe ascunse.</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Întrebări frecvente</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl border transition-all duration-200 ${
                openFaq === i ? 'border-gray-200 shadow-sm' : 'border-gray-100'
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-bold text-gray-900 text-[15px]">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 shrink-0 ml-4 transition-transform duration-200 ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaq === i ? 'max-h-40 pb-5' : 'max-h-0'
                }`}
              >
                <p className="px-5 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <p className="text-gray-400 text-sm font-medium">
          Ai întrebări? Contactează-ne la <span className="text-gray-600 font-bold">support@vindu24.ro</span>
        </p>
      </div>
    </div>
  );
}
