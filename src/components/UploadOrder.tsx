import React, { useState } from 'react';
import { Package, MapPin, User, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

import { useOrders } from '../context/OrderContext';

export default function UploadOrder() {
  const { addOrder } = useOrders();
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    city: 'Quito',
    amount: '',
    priority: 'normal',
    notes: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addOrder({
      trackingNumber: `KTM-REC-${Math.floor(Math.random() * 90000) + 10000}`,
      customerName: formData.customerName,
      deliveryAddress: `${formData.address}, ${formData.city}`,
      status: 'pending',
      amount: parseFloat(formData.amount) || 0,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      estimatedDelivery: 'Pendiente de asignación'
    });

    setIsSuccess(true);
    setFormData({
      customerName: '',
      phone: '',
      address: '',
      city: 'Quito',
      amount: '',
      priority: 'normal',
      notes: ''
    });

    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Pedido</h1>
        <p className="text-gray-500">Registra una nueva entrega en el sistema logístico</p>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="card-utility space-y-8"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <User className="w-3 h-3" /> Nombre del Cliente
              </label>
              <input 
                type="text" 
                required
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                placeholder="Ej. Juan Pérez"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Teléfono / Contacto
              </label>
              <input 
                type="tel" 
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="099-999-9999"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Dirección de Entrega
            </label>
            <input 
              type="text" 
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Calle Principal y Secundaria, Edificio, Oficina"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                Ciudad
              </label>
              <select 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none transition-all bg-white"
              >
                <option>Quito</option>
                <option>Guayaquil</option>
                <option>Cuenca</option>
                <option>Ambato</option>
                <option>Portoviejo</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <DollarSign className="w-3 h-3" /> Valor Total
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                Prioridad
              </label>
              <div className="flex gap-2">
                {['baja', 'normal', 'alta'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({...formData, priority: p})}
                    className={`flex-1 py-2 px-1 text-xs font-bold uppercase rounded-lg border transition-all ${
                      formData.priority === p 
                        ? 'bg-zinc-900 text-white border-zinc-900' 
                        : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              Notas Adicionales
            </label>
            <textarea 
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Instrucciones especiales para el repartidor..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400 max-w-xs">
            Al registrar el pedido, se generará automáticamente un número de trackingLD.
          </p>
          <button type="submit" className={`btn-primary group ${isSuccess ? 'bg-green-600 border-green-600' : ''}`}>
            {isSuccess ? '¡Pedido Registrado!' : 'Registrar Pedido'}
            <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isSuccess ? 'hidden' : ''}`} />
          </button>
        </div>
      </motion.form>
    </div>
  );
}
