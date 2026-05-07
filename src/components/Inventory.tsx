import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Search,
  ArrowRight,
  TrendingUp,
  Box,
  Truck,
  MoreVertical,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StockItem } from '../types';

const MOCK_STOCK: StockItem[] = [
  {
    id: '1',
    productId: 'P-001',
    productName: 'Camisetas Algodón XL',
    quantity: 50,
    status: 'sent',
    shopId: 'tienda-1',
    sentAt: '2024-03-24 10:00'
  },
  {
    id: '2',
    productId: 'P-002',
    productName: 'Zapatillas Running 42',
    quantity: 12,
    status: 'received',
    shopId: 'tienda-1',
    sentAt: '2024-03-23 15:30',
    receivedAt: '2024-03-23 18:00',
    verifiedBy: 'Admin LogiDash'
  }
];

import { useNotifications } from '../context/NotificationContext';

export default function Inventory() {
  const { role } = useAuth();
  const { notify } = useNotifications();
  const [stockItems, setStockItems] = useState<StockItem[]>(MOCK_STOCK);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStock, setNewStock] = useState({ productName: '', quantity: 0 });
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleAction = (action: string, productName: string) => {
    notify('Acción Procesada', `${action}: ${productName}`, 'success');
    setActiveMenuId(null);
  };

  const handleSendStock = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: StockItem = {
      id: Date.now().toString(),
      productId: `P-${Math.floor(Math.random() * 1000)}`,
      productName: newStock.productName,
      quantity: newStock.quantity,
      status: 'sent',
      shopId: 'tienda-1',
      sentAt: new Date().toLocaleString()
    };
    setStockItems([newItem, ...stockItems]);
    setShowAddForm(false);
    setNewStock({ productName: '', quantity: 0 });
  };

  const handleVerifyStock = (id: string) => {
    setStockItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: 'received', receivedAt: new Date().toLocaleString(), verifiedBy: 'Admin Central' } 
        : item
    ));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b-2 border-ktm-orange pb-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-ktm-black">Inventario & <span className="text-ktm-orange">Stock</span></h1>
          <p className="text-gray-500">
            {role === 'admin' 
              ? 'Verifica y confirma la recepción de stock de las tiendas' 
              : 'Envía stock de tus productos para ser gestionados por la transportadora'}
          </p>
        </div>
        {role === 'tienda' && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary h-12 px-6 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Enviar Stock
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'En Envío', value: stockItems.filter(i => i.status === 'sent').length, color: 'text-ktm-orange', bg: 'bg-orange-50' },
          { label: 'Recibidos', value: stockItems.filter(i => i.status === 'received').length, color: 'text-ktm-black', bg: 'bg-gray-50' },
          { label: 'Discrepancias', value: 0, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Total Unidades', value: stockItems.reduce((acc, i) => acc + i.quantity, 0), color: 'text-ktm-orange', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className={`card-utility p-6 border-b-4 ${stat.color === 'text-ktm-orange' ? 'border-b-ktm-orange' : 'border-b-ktm-black'} flex flex-col gap-2`}>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <div className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-8"
            >
              <h3 className="text-xl font-bold text-zinc-900 mb-6">Nuevo Envío de Stock</h3>
              <form onSubmit={handleSendStock} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Producto</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ej. Zapatos Cuero Talla 40"
                    value={newStock.productName}
                    onChange={(e) => setNewStock({ ...newStock, productName: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Cantidad</label>
                  <input 
                    required
                    type="number" 
                    min="1"
                    value={newStock.quantity || ''}
                    onChange={(e) => setNewStock({ ...newStock, quantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 btn-secondary py-4 font-bold text-sm">Cancelar</button>
                  <button type="submit" className="flex-1 btn-primary py-4 font-bold text-sm flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Enviar Todo
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="card-utility bg-white border border-gray-100 overflow-hidden p-0">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <h3 className="font-bold text-sm text-zinc-900">Gestión de Ingresos de Stock</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4 text-left font-bold">Remitente</th>
                <th className="px-6 py-4 text-left font-bold">Producto</th>
                <th className="px-6 py-4 text-left font-bold">Cantidad</th>
                <th className="px-6 py-4 text-left font-bold">Estado</th>
                <th className="px-6 py-4 text-left font-bold">Enviado</th>
                <th className="px-6 py-4 text-left font-bold">Recibido</th>
                <th className="px-6 py-4 text-right font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stockItems.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-zinc-900">Tienda {item.shopId.split('-')[1]}</span>
                      <span className="text-[9px] text-gray-400 uppercase tracking-tight">{item.shopId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-sm text-zinc-900">{item.productName}</span>
                    <p className="text-[10px] text-gray-400 font-mono">{item.productId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Box className="w-4 h-4 text-zinc-300" />
                       <span className="font-bold text-sm">{item.quantity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'received' 
                        ? 'bg-black text-white' 
                        : 'bg-orange-50 text-ktm-orange border border-orange-100 anim-pulse'
                    }`}>
                      {item.status === 'received' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {item.status === 'received' ? 'En Bodega' : 'En camino'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">{item.sentAt}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {item.receivedAt ? (
                      <div className="flex flex-col gap-0.5">
                        <span>{item.receivedAt}</span>
                        <span className="text-[9px] text-gray-400 uppercase">Verif: {item.verifiedBy}</span>
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 relative">
                      {role === 'admin' && item.status === 'sent' && (
                        <button 
                          onClick={() => handleVerifyStock(item.id)}
                          className="btn-primary px-4 py-2 text-[10px] flex items-center gap-2"
                        >
                          <Truck className="w-3 h-3" />
                          Recibir Material
                        </button>
                      )}
                      
                      <div className="relative">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        <AnimatePresence>
                          {activeMenuId === item.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2 overflow-hidden"
                              >
                                <button onClick={() => handleAction('Editar', item.productName)} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-ktm-orange transition-colors">Editar Producto</button>
                                <button onClick={() => handleAction('Ver Historial', item.productName)} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-ktm-orange transition-colors">Ver Historial</button>
                                <button onClick={() => handleAction('Descargar QR', item.productName)} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-ktm-orange transition-colors border-t border-gray-50">Descargar QR</button>
                                <button onClick={() => handleAction('Eliminar', item.productName)} className="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50">Eliminar</button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-ktm-orange rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/30 rotate-3">
            <Clock className="w-6 h-6 -rotate-3" />
          </div>
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-ktm-black">Registro de <span className="text-ktm-orange">Movimientos</span></h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold px-1">Log de telemetría de stock</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {stockItems.filter(i => i.status === 'received').map((item) => (
            <div key={`log-${item.id}`} className="group relative flex items-center gap-6 p-5 bg-white border border-gray-100 rounded-2xl hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-50 transition-all cursor-default overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
               
               <div className="flex flex-col items-center justify-center min-w-[80px] text-center border-r border-gray-100 pr-6">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Cantidad</p>
                  <p className="text-2xl font-black text-zinc-900">{item.quantity}</p>
               </div>

               <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-zinc-900">{item.productName}</h4>
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-md text-gray-500 font-mono">{item.productId}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <div className="flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" />
                      De: Tienda 1
                    </div>
                    <ArrowRight className="w-3 h-3" />
                    <div className="flex items-center gap-1 text-zinc-900">
                      <Box className="w-3 h-3" />
                      Bodega Central (KTM 0)
                    </div>
                  </div>
               </div>

               <div className="text-right space-y-1 pr-4">
                  <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-gray-400">
                    <Send className="w-3 h-3" />
                    Enviado: {item.sentAt}
                  </div>
                  <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-green-600">
                    <CheckCircle2 className="w-3 h-3" />
                    Recibido: {item.receivedAt}
                  </div>
               </div>
            </div>
          ))}

          {stockItems.filter(i => i.status === 'received').length === 0 && (
            <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-sm italic">Aún no hay registros de movimientos completados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
