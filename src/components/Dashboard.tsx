import React from 'react';
import { motion } from 'motion/react';

import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ setActiveTab }: DashboardProps) {
  const { role } = useAuth();

  const statsByRole = {
    admin: [
      { label: 'Total Pedidos', value: '1,284', trend: '+12%', color: 'blue' },
      { label: 'En Tránsito', value: '42', trend: '+5', color: 'orange' },
      { label: 'Entregados Hoy', value: '156', trend: '98%', color: 'green' },
      { label: 'Pagos Pendientes', value: '$12,450', trend: '-2%', color: 'red' },
    ],
    tienda: [
      { label: 'Mis Pedidos', value: '84', trend: '+4%', color: 'blue' },
      { label: 'En Proceso', value: '12', trend: 'Normal', color: 'orange' },
      { label: 'Completados', value: '72', trend: '100%', color: 'green' },
      { label: 'Saldo por Cobrar', value: '$840', trend: 'Facturado', color: 'red' },
    ],
    motorizado: [
      { label: 'Entregas Asignadas', value: '6', trend: 'Hoy', color: 'blue' },
      { label: 'Mi Calificación', value: '4.9', trend: 'Excelencia', color: 'orange' },
      { label: 'Ganancia del Día', value: '$45.00', trend: '+15%', color: 'green' },
      { label: 'Km Recorridos', value: '28km', trend: 'Ruta Optima', color: 'red' },
    ],
  };

  const stats = statsByRole[role];

  const recentNews = [
    { id: 1, title: 'Retraso en Ruta Norte', time: '10 min ago', type: 'warning' },
    { id: 2, title: 'Nueva zona de entrega activa', time: '1h ago', type: 'info' },
    { id: 3, title: 'Actualización de Tarifas', time: '3h ago', type: 'alert' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-ktm-black">Dashboard <span className="text-ktm-orange underline decoration-[4px] underline-offset-8">Operativo</span></h1>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2 px-1">Kilometro 0 Force Management</p>
        </div>
        <div className="text-[10px] text-gray-400 font-bold bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-ktm-orange rounded-full anim-pulse" />
          SYSTEM STATUS: <span className="text-ktm-black font-black uppercase tracking-widest">Active</span> • {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="card-utility hover:border-ktm-orange hover:shadow-xl hover:shadow-orange-500/5 transition-all group cursor-default border-l-4 border-l-ktm-orange"
          >
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <div className="mt-2 flex items-baseline justify-between">
              <h2 className="text-3xl font-black tracking-tighter text-ktm-black italic">{stat.value}</h2>
              <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${
                stat.trend.startsWith('+') ? 'bg-orange-50 text-ktm-orange' : 
                stat.trend.includes('%') ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-utility h-[400px] flex flex-col group">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-black italic uppercase tracking-tighter text-xl text-ktm-black">Monitor de Mapa <span className="text-ktm-orange italic">Live</span></h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Coordenadas de despacho en tiempo real</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-ktm-orange rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-orange-500/20">
                <div className="w-1.5 h-1.5 bg-white rounded-full anim-pulse" />
                12 Riders Activos
              </div>
            </div>
          </div>
          <div className="flex-1 bg-[#111] rounded-2xl flex items-center justify-center border-2 border-white/5 group-hover:border-ktm-orange/20 transition-all bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] relative overflow-hidden">
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-ktm-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-ktm-orange/20">
                <div className="w-4 h-4 bg-ktm-orange rounded-full animate-ping" />
              </div>
              <p className="text-white text-xs font-bold uppercase tracking-[0.2em]">Escaneando Zonas de Entrega...</p>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] mt-1 font-mono">Telemetry stream v4.28</p>
            </div>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-ktm-orange rounded-full shadow-[0_0_10px_#FF6600]" />
                <div className="absolute top-2/3 left-1/2 w-1.5 h-1.5 bg-ktm-orange rounded-full shadow-[0_0_10px_#FF6600]" />
                <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-ktm-orange rounded-full shadow-[0_0_10px_#FF6600]" />
            </div>
          </div>
        </div>
        
        <div className="card-utility flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-zinc-900">Novedades</h3>
            <span className="text-[10px] font-bold bg-zinc-100 text-zinc-500 px-2 py-1 rounded-md">LIVE</span>
          </div>
          <div className="space-y-4">
            {recentNews.map((news) => (
              <div 
                key={news.id} 
                onClick={() => setActiveTab('news')}
                className="flex gap-4 p-4 rounded-2xl hover:bg-zinc-50 transition-all cursor-pointer border border-transparent hover:border-gray-100 active:scale-[0.98]"
              >
                <div className={`w-1 h-8 rounded-full mt-1 ${
                  news.type === 'warning' ? 'bg-ktm-orange' : news.type === 'alert' ? 'bg-ktm-black' : 'bg-gray-300'
                }`} />
                <div>
                  <p className="text-sm font-bold text-zinc-900">{news.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{news.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setActiveTab('news')}
            className="mt-auto w-full text-center text-sm font-bold text-zinc-400 hover:text-zinc-900 py-4 border-t border-gray-50 transition-colors"
          >
            Ver todas las notificaciones
          </button>
        </div>
      </div>

      <div className="card-utility">
        <h3 className="font-bold text-xl text-zinc-900 mb-6">Eficiencia de Flota</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Ocupación', value: '82%', sub: 'Alta' },
              { label: 'Combustible', value: '412L', sub: 'Tanque Promedio' },
              { label: 'Tiempo Medio', value: '24m', sub: 'Por Entrega' },
              { label: 'Incidencias', value: '0.2%', sub: 'Mínimo Histórico' },
            ].map(item => (
              <div key={item.label} className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                <p className="text-2xl font-light text-zinc-900">{item.value}</p>
                <p className="text-[10px] text-zinc-400 font-medium">{item.sub}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
