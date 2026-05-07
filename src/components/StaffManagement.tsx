import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ShieldCheck, 
  Trash2, 
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function StaffManagement() {
  const { user, registeredUsers, register } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    permissions: [] as string[]
  });
  const [success, setSuccess] = useState(false);

  const permissions = [
    { id: 'pedidos', label: 'Subir Pedidos' },
    { id: 'inventario', label: 'Gestionar Inventario' },
    { id: 'reportes', label: 'Ver Reportes' },
    { id: 'novedades', label: 'Ver Novedades' }
  ];

  const togglePermission = (id: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(id) 
        ? prev.permissions.filter(p => p !== id)
        : [...prev.permissions, id]
    }));
  };

  // Filter users that belong to this tienda
  const myStaff = registeredUsers.filter(u => u.parentId === user?.email && u.role === 'vendedor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    register({
      name: formData.name,
      email: formData.email,
      password: '123456789',
      role: 'vendedor',
      parentId: user.email,
      permissions: formData.permissions
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsAdding(false);
      setFormData({ name: '', email: '', permissions: [] });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b-2 border-ktm-orange pb-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-ktm-black">Mi <span className="text-ktm-orange">Equipo</span></h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 px-1">Gestión de vendedoras y personal de tienda</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Agregar Vendedora
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-utility p-6 border-l-4 border-l-ktm-orange">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Staff</p>
          <div className="text-4xl font-black italic tracking-tighter text-ktm-black">{myStaff.length}</div>
        </div>
        <div className="card-utility p-6 border-l-4 border-l-black">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</p>
          <div className="text-4xl font-black italic tracking-tighter text-ktm-black uppercase">Activo</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
              <th className="px-8 py-5 text-left">Vendedora</th>
              <th className="px-8 py-5 text-left">Correo de Acceso</th>
              <th className="px-8 py-5 text-left">Rol</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {myStaff.map((staff) => (
              <tr key={staff.email} className="hover:bg-orange-50/30 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-ktm-orange group-hover:text-white transition-colors">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-zinc-900">{staff.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm text-gray-500 font-mono">{staff.email}</span>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-md">
                    {staff.role}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {myStaff.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-200" />
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No hay vendedoras registradas</p>
                      <p className="text-[10px] text-gray-300 uppercase mt-1">Usa el botón superior para agregar a tu equipo</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl relative z-10"
            >
              <div className="p-8 bg-black">
                <div className="flex justify-between items-center text-white mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-ktm-orange rounded-xl flex items-center justify-center">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black italic uppercase tracking-tighter text-xl">Nueva Vendedora</h3>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Registro de staff Kilometro 0</p>
                    </div>
                  </div>
                  <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                      <input 
                        required
                        type="text" 
                        placeholder="Nombre de la vendedora"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-sm text-white placeholder:text-white/20 focus:border-ktm-orange outline-none transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                      <input 
                        required
                        type="email" 
                        placeholder="Correo de acceso"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-sm text-white placeholder:text-white/20 focus:border-ktm-orange outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 px-1">Permisos de Acceso</label>
                    <div className="grid grid-cols-2 gap-2">
                       {permissions.map(p => (
                         <button
                          type="button"
                          key={p.id}
                          onClick={() => togglePermission(p.id)}
                          className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all text-center ${
                            formData.permissions.includes(p.id)
                              ? 'bg-ktm-orange border-ktm-orange text-white'
                              : 'bg-white/5 border-white/10 text-white/40'
                          }`}
                         >
                           {p.label}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex gap-3 italic">
                    <ShieldCheck className="w-5 h-5 text-ktm-orange shrink-0" />
                    <p className="text-[10px] text-orange-200">Clave predeterminada: <span className="font-black text-white ml-1">123456789</span></p>
                  </div>

                  <button 
                    disabled={success}
                    type="submit" 
                    className={`w-full h-14 btn-primary transition-all relative overflow-hidden ${success ? 'bg-green-500 text-white shadow-green-500/20' : ''}`}
                  >
                    <AnimatePresence mode="wait">
                      {success ? (
                        <motion.div 
                          key="success"
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          ¡REGISTRO EXITOSO!
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="submit"
                          className="flex items-center gap-2"
                        >
                          CONFIRMAR REGISTRO
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
