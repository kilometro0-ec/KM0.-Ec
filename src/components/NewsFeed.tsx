import React from 'react';
import { Bell, Info, AlertTriangle, CheckCircle2, ChevronRight, Clock, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useNotifications } from '../context/NotificationContext';

export default function NewsFeed() {
  const { requestPermission, permission, notify } = useNotifications();
  
  const handleActivatePush = async () => {
    await requestPermission();
    notify('Sistema Activo', 'Has activado las notificaciones push correctamente.', 'success');
  };

  const news = [
    {
      id: 1,
      title: 'Aviso: Mantenimiento de Servidores',
      content: 'El domingo 28 de Marzo realizaremos mejoras en el sistema de rastreo. El servicio podría verse interrumpido de 02:00 a 04:00 AM.',
      type: 'info',
      date: 'Hoy, 10:45 AM',
      author: 'Soporte IT'
    },
    {
      id: 2,
      title: '¡Nueva Zona de Cobertura!',
      content: 'Hemos expandido nuestras operaciones al sector de Cumbayá y Tumbaco. Ya puedes registrar pedidos para estas zonas con entregas el mismo día.',
      type: 'success',
      date: 'Ayer, 08:30 PM',
      author: 'Operaciones'
    },
    {
      id: 3,
      title: 'Retrasos por Condiciones Climáticas',
      content: 'Debido a las fuertes lluvias en la zona sur, las entregas podrían presentar retrasos de 30-45 minutos. Agradecemos su comprensión.',
      type: 'warning',
      date: 'Ayer, 02:20 PM',
      author: 'Logística'
    },
    {
      id: 4,
      title: 'Actualización en Tarifas de Combustible',
      content: 'Se informa un ajuste del 2% en las tarifas base de envío de larga distancia debido al incremento estacional de combustibles.',
      type: 'info',
      date: '22 Mar, 2024',
      author: 'Administración'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center bg-zinc-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">Novedades y Avisos</h1>
          <p className="text-white/60 text-sm mt-1">Mantente al tanto de las actualizaciones críticas en tiempo real</p>
          
          <div className="mt-6 flex items-center gap-4">
            {permission === 'granted' ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/10">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest">Notificaciones Activas</span>
              </div>
            ) : (
              <button 
                onClick={handleActivatePush}
                className="bg-white text-zinc-900 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-100 transition-colors"
              >
                <Bell className="w-4 h-4" />
                Activar Notificaciones Push
              </button>
            )}
            <p className="text-[10px] text-white/40 max-w-[200px] leading-tight">
              Recibe alertas críticas de tráfico, clima y mantenimiento directamente en tu escritorio.
            </p>
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 p-8 text-white/5 -rotate-12 translate-x-4 -translate-y-4">
          <ShieldAlert className="w-48 h-48" />
        </div>

        <div className="flex -space-x-2 relative z-10">
          {[1,2,3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800" />
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-white text-zinc-900 text-[10px] flex items-center justify-center font-bold">
            +12
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {news.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-6 group"
          >
            <div className="flex flex-col items-center">
              <div className={`p-3 rounded-2xl shadow-sm ${
                item.type === 'warning' ? 'bg-orange-50 text-orange-600' : 
                item.type === 'success' ? 'bg-green-50 text-green-600' : 
                'bg-blue-50 text-blue-600'
              }`}>
                {item.type === 'warning' ? <AlertTriangle className="w-6 h-6" /> : 
                 item.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : 
                 <Info className="w-6 h-6" />}
              </div>
              <div className="w-px flex-1 bg-gray-100 my-4" />
            </div>

            <div className="flex-1 card-utility group-hover:border-gray-200 transition-colors relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {item.date}
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                {item.content}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Enviado por: <span className="text-zinc-900">{item.author}</span>
                </span>
                <button className="flex items-center gap-1 text-sm font-medium text-zinc-900 group-hover:underline">
                  Ver detalles <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
