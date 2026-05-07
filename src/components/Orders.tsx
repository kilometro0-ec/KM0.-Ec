import React, { useState } from 'react';
import { Search, Filter, MoreVertical, CheckCircle2, Clock, Truck, AlertCircle, CreditCard, Wallet, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import DeliveryConfirmation from './DeliveryConfirmation';

const MOCK_ORDERS: Order[] = [
  // ... existing mock orders
];

import { useOrders } from '../context/OrderContext';

export default function Orders() {
  const { role } = useAuth();
  const { orders, updateOrder } = useOrders();
  const [confirmingOrder, setConfirmingOrder] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ['Tracking', 'Cliente', 'Direccion', 'Estado', 'Entrega Estimada', 'Pago', 'Total'];
    const rows = filteredOrders.map(order => [
      order.trackingNumber,
      order.customerName,
      order.deliveryAddress,
      order.status,
      order.estimatedDelivery,
      order.paymentStatus,
      order.amount.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_pedidos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeliverClick = (order: Order) => {
    setConfirmingOrder(order);
  };

  const deliverOrder = (id: string) => {
    updateOrder(id, { status: 'delivered' });
    setConfirmingOrder(null);
  };

  const title = {
    admin: 'Gestión de Pedidos',
    tienda: 'Mis Pedidos Enviados',
    motorizado: 'Entregas Asignadas'
  }[role];

  const subtitle = {
    admin: 'Administra y monitorea todas las entregas del sistema',
    tienda: 'Seguimiento de tus paquetes en tiempo real',
    motorizado: 'Rutas y entregas pendientes para hoy'
  }[role];

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {confirmingOrder && (
          <DeliveryConfirmation 
            order={confirmingOrder}
            onClose={() => setConfirmingOrder(null)}
            onConfirm={() => deliverOrder(confirmingOrder.id)}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center border-b-2 border-ktm-orange pb-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-ktm-black">{title.replace('Gestión', 'Control')}</h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 px-1">{subtitle}</p>
        </div>
        <button 
          onClick={role === 'motorizado' ? undefined : exportToCSV}
          className="btn-primary"
        >
          {role === 'motorizado' ? 'Ver Mapa de Ruta' : 'Exportar Reporte'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar por tracking, cliente o dirección..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all outline-none"
          >
            <option value="all">Todos los Estados</option>
            <option value="pending">Pendientes</option>
            <option value="in_transit">En Camino</option>
            <option value="delivered">Entregados</option>
            <option value="cancelled">Cancelados</option>
            <option value="on_hold">En Pausa</option>
          </select>
          <button className="btn-secondary">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Más Filtros</span>
          </button>
        </div>
      </div>

      <div className="card-utility overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-bottom border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 font-mono">Tracking</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 font-mono">Cliente / Dirección</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 font-mono">Estado</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 font-mono">Entrega Est.</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 font-mono">Pago</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 font-mono">Total</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 font-mono"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-zinc-900">{order.trackingNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-ktm-black">{order.customerName}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate max-w-[200px]">{order.deliveryAddress}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-gray-500">{order.estimatedDelivery}</div>
                  </td>
                  <td className="px-6 py-4">
                    <PaymentBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-zinc-900">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 relative">
                      {role === 'motorizado' && order.status !== 'delivered' && (
                        <button 
                          onClick={() => handleDeliverClick(order)}
                          className="btn-primary px-4 py-2 text-[10px]"
                        >
                          Confirmar Entrega
                        </button>
                      )}
                      
                      <div className="relative">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === order.id ? null : order.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        <AnimatePresence>
                          {activeMenuId === order.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 py-2 overflow-hidden text-left"
                              >
                                <button onClick={() => { setActiveMenuId(null); setSelectedOrder(order); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-ktm-orange transition-colors">Ver Detalles</button>
                                <button onClick={() => { setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-ktm-orange transition-colors">Imprimir Guía</button>
                                <button onClick={() => { setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-ktm-orange transition-colors border-t border-gray-50">Rastrear envío</button>
                                <button onClick={() => { setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50">Cancelar Pedido</button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic font-bold uppercase tracking-widest text-xs">
                    No hay pedidos registrados en esta sección
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-white rounded-[40px] overflow-hidden shadow-2xl relative z-50"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-ktm-black leading-none">Orden <span className="text-ktm-orange">{selectedOrder.trackingNumber}</span></h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 px-1">Detalles completos del envío</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                      <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Estado</p>
                      <StatusBadge status={selectedOrder.status} />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                      <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Total a Recaudar</p>
                      <p className="text-xl font-black text-ktm-black">${selectedOrder.amount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-ktm-orange shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Cliente</p>
                        <p className="font-bold text-ktm-black">{selectedOrder.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-ktm-orange shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Dirección</p>
                        <p className="font-bold text-ktm-black">{selectedOrder.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex gap-4">
                    <button className="flex-1 btn-primary py-4">Imprimir Ticket</button>
                    <button onClick={() => setSelectedOrder(null)} className="flex-1 px-8 py-4 bg-gray-100 text-ktm-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-colors">Cerrar</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const configs = {
    pending: { label: 'Pendiente', icon: Clock, color: 'bg-gray-100 text-gray-600' },
    in_transit: { label: 'En Camino', icon: Truck, color: 'bg-orange-50 text-ktm-orange border border-orange-100' },
    delivered: { label: 'Entregado', icon: CheckCircle2, color: 'bg-black text-white' },
    cancelled: { label: 'Cancelado', icon: AlertCircle, color: 'bg-red-50 text-red-600' },
    on_hold: { label: 'En Pausa', icon: Clock, color: 'bg-amber-50 text-amber-600' },
  };

  const { label, icon: Icon, color } = configs[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function PaymentBadge({ status }: { status: Order['paymentStatus'] }) {
  const isPaid = status === 'paid';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
      isPaid ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
    }`}>
      {isPaid ? <CreditCard className="w-3 h-3" /> : <Wallet className="w-3 h-3" />}
      {isPaid ? 'Pagado' : 'Pendiente'}
    </span>
  );
}
