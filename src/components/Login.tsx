import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, ShieldCheck, ShoppingBag, Bike, ArrowRight, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

type AuthMode = 'login' | 'register';

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState<string | null>(null);

  const { login, register } = useAuth();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      const success = login(formData.email, formData.password);
      if (!success) {
        setError('Credenciales inválidas. Intenta de nuevo.');
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Por favor completa todos los campos.');
        return;
      }
      register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole
      });
      setError(null);
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      setMode('login');
    }
  };

  const roles = [
    { 
      id: 'admin', 
      label: 'Administrador', 
      desc: 'Gestión total y logística central', 
      icon: ShieldCheck, 
      color: 'bg-black',
      canRegister: false
    },
    { 
      id: 'tienda', 
      label: 'Tienda / Comercio', 
      desc: 'Sube pedidos y rasta tus envíos', 
      icon: ShoppingBag, 
      color: 'bg-km0-orange',
      canRegister: true 
    },
    { 
      id: 'motorizado', 
      label: 'Motorizado / Rider', 
      desc: 'Gestiona tus rutas y estados', 
      icon: Bike, 
      color: 'bg-km0-orange',
      canRegister: true 
    }
  ];

  const filteredRoles = mode === 'register' ? roles.filter(r => r.canRegister) : roles;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-km0-orange opacity-[0.03] blur-[120px] -translate-y-1/2 translate-x-1/2 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-km0-orange opacity-[0.02] blur-[100px] translate-y-1/2 -translate-x-1/2 rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-km0-orange rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/20 rotate-3">
            <Truck className="text-white w-8 h-8 -rotate-3" />
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Kilometro <span className="text-km0-orange">0</span></h1>
          <p className="text-gray-500 mt-2 text-[10px] font-bold uppercase tracking-[0.2em]">Ready to Deliver</p>
        </div>

        <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 space-y-8 shadow-2xl">
          <div className="flex gap-2 p-1 bg-white/[0.03] rounded-xl">
             <button 
              onClick={() => { setMode('login'); setSelectedRole('admin'); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${mode === 'login' ? 'bg-km0-orange text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
             >
               Ingresar
             </button>
             <button 
              onClick={() => { setMode('register'); setSelectedRole('tienda'); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${mode === 'register' ? 'bg-km0-orange text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
             >
               Registrarse
             </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 px-1">
                    Rol de Registro
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {filteredRoles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id as UserRole)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${
                          selectedRole === role.id 
                            ? 'border-km0-orange bg-white/5' 
                            : 'border-white/[0.03] hover:border-white/10 bg-transparent'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg text-white ${role.color} shadow-lg transition-transform group-hover:scale-110`}>
                          <role.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-white leading-none">{role.label}</p>
                        </div>
                        {selectedRole === role.id && (
                          <div className="w-1.5 h-1.5 bg-km0-orange rounded-full shadow-[0_0_10px_#FF6600]" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
               <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 px-1">Datos de Acceso</label>
               <AnimatePresence mode="popLayout">
                 {mode === 'register' && (
                   <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                   >
                     <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                     <input 
                      required
                      type="text" 
                      placeholder="Nombre Completo / Razón Social"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl text-sm text-white placeholder:text-gray-600 focus:border-km0-orange outline-none transition-all"
                     />
                   </motion.div>
                 )}
               </AnimatePresence>
               
               <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                 <input 
                  required
                  type="text"
                  placeholder={mode === 'login' ? 'Correo o Usuario' : 'Correo Electrónico'}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl text-sm text-white placeholder:text-gray-600 focus:border-km0-orange outline-none transition-all"
                 />
               </div>
               
               <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                 <input 
                  required
                  type="password" 
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl text-sm text-white placeholder:text-gray-600 focus:border-km0-orange outline-none transition-all"
                 />
               </div>
            </div>

            {error && (
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">{error}</p>
            )}

            <button 
              type="submit" 
              className="w-full btn-primary h-14 text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {mode === 'login' ? 'Iniciar Sesión' : 'Registrar Cuenta'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500">
          ¿Problemas con el acceso? Contacta a <span className="font-bold text-km0-orange cursor-pointer hover:underline uppercase tracking-widest">Soporte KM0</span>
        </p>
      </motion.div>
    </div>
  );
}
