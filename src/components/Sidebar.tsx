import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Upload, 
  CreditCard, 
  Bell, 
  Settings, 
  LogOut,
  Truck,
  Shield,
  Users,
  Box
} from 'lucide-react';
import { motion } from 'motion/react';

import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { role, setRole, logout } = useAuth();
  
  const allItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'tienda', 'motorizado', 'vendedor'] },
    { id: 'orders', icon: Package, label: 'Pedidos', roles: ['admin', 'tienda', 'motorizado', 'vendedor'] },
    { id: 'inventory', icon: Box, label: 'Inventario', roles: ['admin', 'tienda'] },
    { id: 'users', icon: Users, label: 'Usuarios', roles: ['admin', 'tienda'] },
    { id: 'upload', icon: Upload, label: 'Subir Pedido', roles: ['admin', 'tienda', 'vendedor'] },
    { id: 'payments', icon: CreditCard, label: 'Pagos', roles: ['admin'] },
    { id: 'settings', icon: Settings, label: 'Configuración', roles: ['admin', 'tienda'] },
    { id: 'news', icon: Bell, label: 'Novedades', roles: ['admin', 'tienda', 'motorizado', 'vendedor'] },
  ];

  const menuItems = allItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-km0-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
          <Truck className="text-white w-6 h-6" />
        </div>
        <span className="font-black text-xl tracking-tighter uppercase italic">Kilometro <span className="text-km0-orange">0</span></span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === item.id
                ? 'bg-km0-orange text-white shadow-lg shadow-orange-500/20'
                : 'text-gray-500 hover:bg-gray-50 hover:text-km0-black'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.id === 'users' && role === 'tienda' ? 'Mi Equipo' : item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-1">
        {role === 'admin' && (
          <div className="mb-4 px-3 py-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Simular Vista</p>
            <div className="grid grid-cols-2 gap-1">
              {(['tienda', 'motorizado'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className="px-2 py-1.5 text-[10px] font-bold uppercase bg-white border border-gray-200 rounded-lg hover:border-km0-orange hover:text-km0-orange transition-all font-mono"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {role !== 'admin' && (
           <button 
            onClick={() => setRole('admin')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-km0-orange bg-orange-50 hover:bg-orange-100 transition-all mb-2"
          >
            <Shield className="w-4 h-4" />
            Volver a Admin
          </button>
        )}

        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'settings' ? 'bg-km0-orange text-white shadow-lg shadow-orange-500/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Settings className="w-5 h-5" />
          Configuración
        </button>
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Salir
        </button>
      </div>
    </aside>
  );
}
