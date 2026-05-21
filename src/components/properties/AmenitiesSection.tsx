'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { AMENITIES_GROUPS } from '@/constants/amenities';

interface AmenitiesSectionProps {
  propertyAmenities: string[];
}

export default function AmenitiesSection({ propertyAmenities }: AmenitiesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryColors = [
    { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', iconBg: 'bg-sky-100', iconColor: 'text-sky-600', dot: 'bg-sky-400' },
    { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', iconBg: 'bg-violet-100', iconColor: 'text-violet-600', dot: 'bg-violet-400' },
    { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', dot: 'bg-amber-400' },
    { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', dot: 'bg-emerald-400' },
    { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', iconBg: 'bg-rose-100', iconColor: 'text-rose-600', dot: 'bg-rose-400' },
  ];

  const activeGroups = AMENITIES_GROUPS.map((group, gIdx) => ({
    ...group,
    activeItems: group.items.filter(item => propertyAmenities.includes(item.id)),
    color: categoryColors[gIdx % categoryColors.length],
  })).filter(g => g.activeItems.length > 0);

  const categorizedIds = AMENITIES_GROUPS.flatMap(g => g.items.map(i => i.id));
  const unCategorizedItems = propertyAmenities.filter(a => !categorizedIds.includes(a));

  if (activeGroups.length === 0 && unCategorizedItems.length === 0) return null;

  // Split Main vs Hidden (Accessibility is often "secondary" detail in real estate lists)
  const mainGroups = activeGroups.filter(g => g.title !== 'Accesibilitate & Protecție');
  const hiddenGroups = activeGroups.filter(g => g.title === 'Accesibilitate & Protecție');

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Premium Header */}
      <div className="px-8 pt-8 pb-6 bg-gray-50/80 border-b border-gray-100">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-baseline gap-4">
            <h2 className="text-[22px] font-black text-gray-900 tracking-tight">Caracteristici și Facilități</h2>
            <span className="text-sm text-gray-400 font-medium hidden sm:block">Tot ce oferă această proprietate</span>
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest bg-white px-3 py-1.5 rounded-full border border-gray-200">
            {propertyAmenities.length} facilități
          </span>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Main Categories Section */}
        <div className="space-y-10">
          {mainGroups.map((group) => {
            const color = group.color;
            return (
              <div key={group.title} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${color.dot} shadow-[0_0_8px_rgba(0,0,0,0.1)]`}></div>
                  <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-[0.12em]">{group.title}</h3>
                  <div className="flex-1 h-px bg-gray-50"></div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {group.activeItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        className={`group flex items-center gap-3 px-4 py-3 rounded-2xl ${color.bg} border ${color.border} hover:shadow-lg hover:shadow-${color.text.split('-')[1]}-100/50 hover:-translate-y-0.5 transition-all duration-300 cursor-default`}
                      >
                        <div className={`w-8 h-8 rounded-xl ${color.iconBg} flex items-center justify-center ${color.iconColor} shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <Icon size={16} strokeWidth={2.2} />
                        </div>
                        <span className="text-[14px] font-bold text-gray-800 tracking-tight">{item.id}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary / Hidden Sections */}
        {(hiddenGroups.length > 0 || unCategorizedItems.length > 0) && (
          <div className="pt-2">
            {!isExpanded ? (
              <button
                onClick={() => setIsExpanded(true)}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 font-bold text-sm tracking-wide hover:bg-gray-50 hover:border-emerald-300 hover:text-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Mostrar más detalles (Accesibilitate & Protecție)</span>
                <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
              </button>
            ) : (
              <div className="space-y-10 animate-in fade-in slide-in-from-top-2 duration-500">
                {hiddenGroups.map((group) => {
                  const color = group.color;
                  return (
                    <div key={group.title} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${color.dot}`}></div>
                        <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-[0.12em]">{group.title}</h3>
                        <div className="flex-1 h-px bg-gray-50"></div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {group.activeItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <div
                              key={item.id}
                              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl ${color.bg} border ${color.border} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default`}
                            >
                              <div className={`w-8 h-8 rounded-xl ${color.iconBg} flex items-center justify-center ${color.iconColor} shadow-sm group-hover:scale-110 transition-all duration-300`}>
                                <Icon size={16} strokeWidth={2.2} />
                              </div>
                              <span className="text-[14px] font-bold text-gray-800 tracking-tight">{item.id}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {unCategorizedItems.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                      <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-[0.12em]">Alte Facilități</h3>
                      <div className="flex-1 h-px bg-gray-50"></div>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {unCategorizedItems.map((item) => (
                        <div key={item} className="flex items-center gap-2.5 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                          <Check size={14} className="text-gray-400" strokeWidth={3} />
                          <span className="text-[13px] font-bold text-gray-600 tracking-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-full py-4 rounded-2xl border border-gray-100 bg-gray-50 text-gray-400 font-bold text-sm tracking-wide hover:bg-gray-100 hover:text-gray-600 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>Mostrar menos</span>
                  <ChevronUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
