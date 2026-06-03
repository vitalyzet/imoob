'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Building2, CarFront } from 'lucide-react';

type DomainMode = 'imobiliare' | 'auto';

interface DomainContextType {
  domain: DomainMode;
  toggleDomain: () => void;
  setDomain: (domain: DomainMode) => void;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export function DomainProvider({ children }: { children: React.ReactNode }) {
  const [domain, setDomainState] = useState<DomainMode>('imobiliare');
  const [mounted, setMounted] = useState(false);
  
  // Transition state
  const [transitionState, setTransitionState] = useState<'idle' | 'entering' | 'active' | 'leaving'>('idle');
  const [targetDomain, setTargetDomain] = useState<DomainMode | null>(null);

  useEffect(() => {
    // Load from localStorage if available
    const savedDomain = localStorage.getItem('vindu24_domain') as DomainMode;
    if (savedDomain === 'auto' || savedDomain === 'imobiliare') {
      setDomainState(savedDomain);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Apply theme class to body
    if (domain === 'auto') {
      document.body.classList.add('theme-auto');
    } else {
      document.body.classList.remove('theme-auto');
    }
    
    // Save to localStorage
    localStorage.setItem('vindu24_domain', domain);
  }, [domain, mounted]);

  const setDomain = (newDomain: DomainMode) => {
    if (newDomain === domain || transitionState !== 'idle') return;
    
    setTargetDomain(newDomain);
    setTransitionState('entering');
    
    // Show overlay first
    setTimeout(() => {
      setTransitionState('active');
      
      // Hold the loading screen for 3 seconds, THEN switch domain
      setTimeout(() => {
        setDomainState(newDomain); // Switch domain at the end
        setTransitionState('leaving');
        
        // Fade out overlay
        setTimeout(() => {
          setTransitionState('idle');
          setTargetDomain(null);
        }, 500);
      }, 2500);
    }, 10);
  };

  const toggleDomain = () => {
    setDomain(domain === 'imobiliare' ? 'auto' : 'imobiliare');
  };

  return (
    <DomainContext.Provider value={{ domain, toggleDomain, setDomain }}>
      {children}
      
      {/* Premium Cinematic Transition Overlay */}
      {transitionState !== 'idle' && (
        <div 
          className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center transition-opacity duration-500 ease-out ${
            transitionState === 'entering' || transitionState === 'leaving' ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}
        >
          {/* Subtle ambient glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]"
              style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)' }} />
          </div>

          <div className="relative flex flex-col items-center gap-10">
            {/* Icons crossfade */}
            <div className="relative w-20 h-20">
              {/* Outgoing icon (the one we're leaving) */}
              <div className="absolute inset-0 flex items-center justify-center transition-all duration-[1200ms] ease-in-out"
                style={{
                  opacity: transitionState === 'active' ? 0 : 0.6,
                  transform: transitionState === 'active' ? 'scale(0.6) translateY(-20px)' : 'scale(1) translateY(0)',
                }}>
                <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                  {targetDomain === 'auto' ? (
                    <Building2 size={36} className="text-white/60" strokeWidth={1.5} />
                  ) : (
                    <CarFront size={36} className="text-white/60" strokeWidth={1.5} />
                  )}
                </div>
              </div>
              
              {/* Incoming icon (the one we're going to) */}
              <div className="absolute inset-0 flex items-center justify-center transition-all duration-[1200ms] ease-in-out"
                style={{
                  opacity: transitionState === 'active' ? 1 : 0,
                  transform: transitionState === 'active' ? 'scale(1) translateY(0)' : 'scale(0.6) translateY(20px)',
                }}>
                <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 shadow-2xl shadow-sky-500/10">
                  {targetDomain === 'auto' ? (
                    <CarFront size={36} className="text-white" strokeWidth={1.5} />
                  ) : (
                    <Building2 size={36} className="text-white" strokeWidth={1.5} />
                  )}
                </div>
              </div>
            </div>

            {/* VINDU24 wordmark */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-white/90 text-[22px] font-black tracking-[0.15em]">VINDU24</span>
              <span className="text-white/40 text-[12px] font-medium tracking-widest uppercase">
                {targetDomain === 'auto' ? 'Vehicule' : 'Imobiliare'}
              </span>
            </div>

            {/* Elegant progress bar */}
            <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-400 to-sky-300 rounded-full transition-none"
                style={{
                  width: transitionState === 'active' ? '100%' : '0%',
                  transition: transitionState === 'active' ? 'width 2.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </DomainContext.Provider>
  );
}

export function useDomain() {
  const context = useContext(DomainContext);
  if (context === undefined) {
    throw new Error('useDomain must be used within a DomainProvider');
  }
  return context;
}
