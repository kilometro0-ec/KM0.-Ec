import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  Power, 
  MoreVertical, 
  Mail, 
  Calendar,
  ShieldCheck,
  ShoppingBag,
  Bike,
  Plus,
  X,
  UserPlus,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

export default function UserManagement() {
  const { role, user: currentUser, registeredUsers, register } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'tienda' as UserRole
  });

  const hanldeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      ...formData,
      status: 'active'
    } as any);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsAdding(false);
      setFormData({ name: '', email: '', password: '', role: 'tienda' });
    }, 2000);
  };

  const filteredUsers = registeredUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b-2 border-ktm-orange pb-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-ktm-black">Gestión de <span className="text-ktm-orange">Sistemas</span></h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 px-1">Administración central de cuentas y permisos</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Registrar {roleFilter === 'motorizado' ? 'Motorizado' : 'Tienda'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o correo..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-ktm-orange transition-all outline-none text-sm font-bold"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest focus:border-ktm-orange outline-none transition-all"
          >
            <option value="all">TODOS LOS ROLES</option>
            <option value="tienda">TIENDAS</option>
            <option value="motorizado">MOTORIZADOS</option>
            <option value="vendedor">VENDEDORAS</option>
            <option value="admin">ADMINS</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredUsers.map((user) => (
            <motion.div
              layout
              key={user.email}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card-utility p-6 bg-white border border-gray-100 relative group overflow-hidden border-b-4 border-b-black hover:border-ktm-orange transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110 ${
                  user.role === 'admin' ? 'bg-black text-white' : 
                  user.role === 'tienda' ? 'bg-ktm-orange text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {user.role === 'tienda' ? <ShoppingBag className="w-6 h-6" /> : 
                   user.role === 'motorizado' ? <Bike className="w-6 h-6" /> : 
                   user.role === 'admin' ? <ShieldCheck className="w-6 h-6" /> : <UsersIcon className="w-6 h-6" />}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-black tracking-[0.2em] px-3 py-1 rounded-md bg-black text-white shadow-sm">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-black italic uppercase tracking-tighter text-xl text-ktm-black">{user.name}</h3>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Mail className="w-3 h-3 text-ktm-orange" />
                  {user.email}
                </div>
                {user.parentId && (
                  <div className="mt-2 text-[9px] font-black text-white bg-ktm-orange px-2 py-0.5 rounded inline-block uppercase tracking-wider">
                    DE: {user.parentId}
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between gap-4">
                <button 
                  onClick={() => setSelectedUser(user)}
                  className="flex-1 btn-primary py-3 text-[10px]"
                >
                  <MoreVertical className="w-4 h-4" />
                  Detalles
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
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
              className="w-full max-w-md bg-white rounded-[40px] overflow-hidden shadow-2xl relative z-50"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-ktm-black">Nuevo <span className="text-ktm-orange">Registro</span></h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Creación de cuenta de alta jerarquía</p>
                  </div>
                  <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <form onSubmit={hanldeSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <UsersIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                      <input 
                        required
                        type="text" 
                        placeholder="Nombre / Razón Social"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:border-ktm-orange outline-none transition-all font-bold"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                      <input 
                        required
                        type="email" 
                        placeholder="Correo de acceso"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:border-ktm-orange outline-none transition-all font-bold"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                      <input 
                        required
                        type="text" 
                        placeholder="Contraseña inicial"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:border-ktm-orange outline-none transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 px-1">Rol de Cuenta</label>
                    <div className="grid grid-cols-2 gap-2">
                       {[
                         { id: 'tienda', label: 'Tienda' },
                         { id: 'motorizado', label: 'Motorizado' }
                       ].map(r => (
                         <button
                          type="button"
                          key={r.id}
                          onClick={() => setFormData({...formData, role: r.id as UserRole})}
                          className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all text-center ${
                            formData.role === r.id
                              ? 'bg-ktm-orange border-ktm-orange text-white shadow-lg shadow-orange-500/20'
                              : 'bg-white border-gray-100 text-gray-400'
                          }`}
                         >
                           {r.label}
                         </button>
                       ))}
                    </div>
                  </div>

                  <button 
                    disabled={success}
                    type="submit" 
                    className={`w-full h-14 btn-primary transition-all mt-4 ${success ? 'bg-green-500 text-white shadow-green-500/20' : ''}`}
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
                          ¡REGISTRADO!
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="submit"
                          className="flex items-center gap-2"
                        >
                          GUARDAR REGISTRO
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white rounded-[40px] overflow-hidden shadow-2xl relative z-50"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-4 rounded-3xl ${
                    selectedUser.role === 'tienda' ? 'bg-ktm-orange' : 'bg-black'
                  } text-white shadow-2xl shadow-orange-500/20`}>
                    {selectedUser.role === 'tienda' ? <ShoppingBag className="w-10 h-10" /> : <Bike className="w-10 h-10" />}
                  </div>
                  <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] block mb-1">Identidad</span>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-ktm-black leading-none">{selectedUser.name}</h3>
                    <p className="text-gray-400 font-bold mt-2 flex items-center gap-2">
                       <Mail className="w-4 h-4 text-ktm-orange" />
                       {selectedUser.email}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Rol del Sistema</p>
                      <p className="text-xs font-black uppercase text-ktm-black tracking-wider">{selectedUser.role}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Estado Cuenta</p>
                      <p className="text-xs font-black uppercase text-green-500 tracking-wider">Activa</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-ktm-orange transition-all shadow-xl shadow-black/10">Descargar Credenciales</button>
                    <button className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-100 transition-all">Suspender Acceso</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {filteredUsers.length === 0 && (
        <div className="py-24 text-center bg-gray-50 rounded-[40px] border-4 border-dashed border-gray-100">
          <UsersIcon className="w-20 h-20 text-gray-200 mx-auto mb-6" />
          <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-sm">No se encontraron registros</p>
        </div>
      )}
    </div>
  );
}
