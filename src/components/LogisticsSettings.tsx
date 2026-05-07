import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DollarSign, Save, Calculator, ArrowRight, TrendingUp } from 'lucide-react';

export default function LogisticsSettings() {
  const [fees, setFees] = useState({
    clientFee: 4.00,
    riderPay: 2.75
  });

  const profit = fees.clientFee - fees.riderPay;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Configuración Logística</h1>
        <p className="text-gray-500">Define las tarifas de servicio y pagos a motorizados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card-utility p-8 bg-white border-zinc-200 shadow-xl space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900">Calculadora de Tarifas</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Cobro a Tienda (Cliente)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="number" 
                  step="0.01"
                  value={fees.clientFee}
                  onChange={(e) => setFees({ ...fees, clientFee: parseFloat(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Pago a Motorizado (Rider)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="number" 
                  step="0.01"
                  value={fees.riderPay}
                  onChange={(e) => setFees({ ...fees, riderPay: parseFloat(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <button className="w-full btn-primary h-12 flex justify-center gap-2">
            <Save className="w-4 h-4" />
            Guardar Configuración
          </button>
        </div>

        <div className="space-y-6">
          <div className="card-utility p-8 bg-zinc-900 text-white border-none shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center justify-center text-center py-4">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Margen de Operación</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">${profit.toFixed(2)}</span>
                <span className="text-white/40 text-xs font-medium">por pedido</span>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-4 relative z-10">
              <div className="text-center">
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Costo Tienda</p>
                <p className="text-sm font-bold font-mono">${fees.clientFee.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Costo Rider</p>
                <p className="text-sm font-bold font-mono text-orange-400">-${fees.riderPay.toFixed(2)}</p>
              </div>
            </div>

            <div className="absolute top-0 right-0 p-8 text-white/[0.03] -rotate-12 translate-x-1/4 -translate-y-1/4">
              <TrendingUp className="w-48 h-48" />
            </div>
          </div>

          <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg h-fit">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-blue-900 uppercase tracking-widest mt-1">Sugerencia del Sistema</p>
              <p className="text-xs text-blue-700/70 leading-relaxed">Considera un margen de al menos 20% para cubrir costos operativos y de mantenimiento del sistema.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
