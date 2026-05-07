import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import UploadOrder from './components/UploadOrder';
import Payments from './components/Payments';
import NewsFeed from './components/NewsFeed';
import UserManagement from './components/UserManagement';
import Inventory from './components/Inventory';
import StaffManagement from './components/StaffManagement';
import LogisticsSettings from './components/LogisticsSettings';
import Login from './components/Login';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { User, Bell, Search } from 'lucide-react';

import { OrderProvider } from './context/OrderContext';

export default function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const { role, user, isAuthenticated, logout, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({ name: '', email: '' });

  if (!isAuthenticated || !user) {
    return <Login />;
  }

  const handleEditProfile = () => {
    setProfileData({ name: user.name, email: user.email });
    setIsEditingProfile(true);
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(profileData);
    setIsEditingProfile(false);
  };

  const handleNotificationClick = (type: string) => {
    if (type === 'pedido') setActiveTab('orders');
    if (type === 'inventario') setActiveTab('inventory');
    if (type === 'pago') setActiveTab('payments');
    setShowNotifications(false);
  };

  const notifications = [
    { id: 1, title: 'Nuevo Pedido KTM-REC-992', time: 'Hace 5 min', unread: true, type: 'pedido' },
    { id: 2, title: 'Inventario Actualizado', time: 'Hace 1 hora', unread: false, type: 'inventario' },
    { id: 3, title: 'Pago Verificado', time: 'Hace 3 horas', unread: false, type: 'pago' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 selection:bg-zinc-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        {/* Global Header */}
        <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-zinc-900 transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar pedidos, facturas o rutas..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setShowNotifications(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-30 overflow-hidden"
                      >
                        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                          <h3 className="text-xs font-black uppercase tracking-widest text-ktm-black">Notificaciones</h3>
                          <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">3 Nuevas</span>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map(n => (
                            <div 
                              key={n.id} 
                              onClick={() => handleNotificationClick(n.type)}
                              className="p-4 border-b border-gray-50 hover:bg-orange-50/30 transition-colors cursor-pointer group"
                            >
                              <p className="text-sm font-bold text-ktm-black group-hover:text-ktm-orange transition-colors">{n.title}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                            </div>
                          ))}
                        </div>
                        <button className="w-full p-3 text-[10px] font-bold text-gray-500 hover:text-ktm-orange transition-colors bg-gray-50 uppercase tracking-widest border-t border-gray-100">
                          Ver todas las alertas
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              <div className="h-8 w-px bg-gray-100 mx-1" />
              <div className="flex items-center gap-3 pl-2 group cursor-pointer" onClick={handleEditProfile}>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-zinc-900 leading-none group-hover:text-ktm-orange transition-colors">{user.name}</p>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter mt-1">
                    {role === 'admin' ? 'Dueño Transportadora' : role === 'tienda' ? 'Tienda / Cliente' : role === 'vendedor' ? 'Vendedora de Tienda' : 'Motorizado / Rider'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center border border-gray-200 group-hover:border-ktm-orange transition-all shadow-sm overflow-hidden group-hover:bg-red-50">
                  <User className="w-5 h-5 text-zinc-600 group-hover:text-ktm-orange" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {isEditingProfile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditingProfile(false)}
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
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter text-ktm-black">Editar <span className="text-ktm-orange">Perfil</span></h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Configuración de tu cuenta Kilometro 0</p>
                    </div>
                  </div>

                  <form onSubmit={saveProfile} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Nombre Completo</label>
                        <input 
                          type="text" 
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-ktm-orange outline-none transition-all font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Correo Electrónico</label>
                        <input 
                          type="email" 
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-ktm-orange outline-none transition-all font-bold"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setIsEditingProfile(false)} className="flex-1 px-8 py-4 bg-gray-100 text-ktm-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-colors">Cancelar</button>
                      <button type="submit" className="flex-1 btn-primary py-4">Guardar Cambios</button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${role}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
              {activeTab === 'orders' && <Orders />}
              {activeTab === 'users' && (role === 'admin' ? <UserManagement /> : <StaffManagement />)}
              {activeTab === 'inventory' && <Inventory />}
              {activeTab === 'upload' && <UploadOrder />}
              {activeTab === 'payments' && <Payments />}
              {activeTab === 'settings' && <LogisticsSettings />}
              {activeTab === 'news' && <NewsFeed />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
