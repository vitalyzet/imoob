'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, Home, X } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const router = useRouter();

  // Clear errors when switching modes
  useEffect(() => setError(''), [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        router.push('/');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        if (userCredential.user) {
          if (formData.name) {
            await updateProfile(userCredential.user, { displayName: formData.name });
          }
          // Crear documento inicial del usuario en Firestore
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            name: formData.name || '',
            email: formData.email,
            phone: '',
            walletBalance: 0,
            walletHistory: [],
            emailVerified: userCredential.user.emailVerified,
            createdAt: new Date(),
            blocked: false
          });
        }
        router.push('/');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') setError('Este correo ya está registrado.');
      else if (err.code === 'auth/invalid-credential') setError('Credenciales incorrectas.');
      else if (err.code === 'auth/weak-password') setError('La contraseña debe tener al menos 6 caracteres.');
      else setError('Ha ocurrido un error. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-900">
      
      {/* Background with blurred shapes for Premium Glassmorphism Look */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Home" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#139E69] rounded-full blur-[120px] mix-blend-screen opacity-20"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] bg-[#f25c1a] rounded-full blur-[120px] mix-blend-screen opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
      </div>

      <Link href="/" className="absolute top-6 left-6 z-50 text-white/50 hover:text-white transition-colors flex items-center gap-2 group">
         <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/5">
           <Home size={18} />
         </div>
         <span className="text-sm font-bold tracking-wide uppercase opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
           Volver al inicio
         </span>
      </Link>

      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white/5 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/10 relative z-10 overflow-hidden">
        
        {/* Left Side: Dynamic Branding / Info */}
        <div className="relative hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-[#139E69]/90 to-[#0e704a]/90 text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10">
            <Link href="/" className="text-4xl font-serif font-black tracking-tighter text-white inline-block">
              IMOOB<span className="text-[#f25c1a]">.</span>
            </Link>
            <div className="mt-12 space-y-6">
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex gap-4">
                 <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20"><User size={20} /></div>
                 <div>
                   <h3 className="font-bold text-lg">Perfil Único</h3>
                   <p className="text-sm text-emerald-100 mt-1">Guarda búsquedas, chatea con propietarios y sube tus inmuebles.</p>
                 </div>
               </motion.div>
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex gap-4">
                 <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20"><Lock size={20} /></div>
                 <div>
                   <h3 className="font-bold text-lg">Privacidad Total</h3>
                   <p className="text-sm text-emerald-100 mt-1">Tus datos están blindados con la tecnología más avanzada del sector.</p>
                 </div>
               </motion.div>
            </div>
          </div>

          <div className="relative z-10 mt-12 bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-sm">
             <p className="text-sm font-medium leading-relaxed italic text-emerald-50">"IMOOB me permitió vender mi casa en 2 semanas sin comisiones abusivas. Una tecnología impecable."</p>
             <div className="mt-4 flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-emerald-800 border-2 border-white/50 overflow-hidden">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" alt="Reseña" />
               </div>
               <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">María López</span>
             </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-8 md:p-12">
          <div className="w-full max-w-sm mx-auto h-full flex flex-col justify-center relative">
            
            {/* Header Switch */}
            <div className="flex bg-white/10 p-1 rounded-full mb-10 border border-white/5 relative">
               <motion.div 
                 className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-lg"
                 layoutId="activeTab"
                 initial={false}
                 animate={{ 
                   left: isLogin ? '4px' : 'calc(50%)'
                 }}
                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
               />
               <button 
                 onClick={() => setIsLogin(true)} 
                 className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${isLogin ? 'text-slate-900' : 'text-white hover:text-white/80'}`}
               >
                 Entrar
               </button>
               <button 
                 onClick={() => setIsLogin(false)} 
                 className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${!isLogin ? 'text-slate-900' : 'text-white hover:text-white/80'}`}
               >
                 Crear Cuenta
               </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {isLogin ? 'Bienvenido de nuevo' : 'Comienza tu viaje'}
                  </h2>
                  <p className="text-slate-400">
                    {isLogin ? 'Introduce tus credenciales para acceder.' : 'Crea una cuenta para acceder a herramientas exclusivas.'}
                  </p>
                </div>

                <AnimatePresence>
                   {error && (
                     <motion.div 
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       exit={{ opacity: 0, height: 0 }}
                       className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 flex items-start gap-3 text-sm"
                     >
                       <X size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
                       <p>{error}</p>
                     </motion.div>
                   )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Nombre Completo</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <User size={18} />
                        </div>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#139E69] focus:border-transparent transition-all placeholder:text-slate-600"
                          placeholder="Juan Pérez"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Correo Electrónico</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Mail size={18} />
                      </div>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#139E69] focus:border-transparent transition-all placeholder:text-slate-600"
                        placeholder="tu@correo.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1 flex justify-between">
                      Contraseña
                      {isLogin && <a href="#" className="text-[#139E69] hover:underline normal-case tracking-normal">¿Olvidaste tu contraseña?</a>}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Lock size={18} />
                      </div>
                      <input 
                        type="password" 
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#139E69] focus:border-transparent transition-all placeholder:text-slate-600"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 bg-gradient-to-r from-[#139E69] to-[#0e704a] hover:from-[#108c5c] hover:to-[#0b5e3d] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(19,158,105,0.3)] hover:shadow-[0_0_25px_rgba(19,158,105,0.5)] disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {isLoading ? (
                       <Loader2 size={20} className="animate-spin" />
                    ) : (
                       <>
                         {isLogin ? 'Acceder al panel' : 'Crear mi cuenta'}
                         <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                       </>
                    )}
                  </button>
                </form>
              </motion.div>
            </AnimatePresence>
            
          </div>
        </div>

      </div>
    </div>
  );
}
