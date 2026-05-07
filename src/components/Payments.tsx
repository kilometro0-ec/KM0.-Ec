import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Wallet, Receipt, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Payments() {
  const transactions = [
    { id: 1, type: 'income', customer: 'Juan Pérez', amount: 15.50, date: '24 Mar, 2024', status: 'completed' },
    { id: 2, type: 'income', customer: 'Restaurante El Sol', amount: 84.10, date: '23 Mar, 2024', status: 'pending' },
    { id: 3, type: 'payout', customer: 'Liquidación Semanal', amount: 450.00, date: '22 Mar, 2024', status: 'completed' },
    { id: 4, type: 'income', customer: 'María García', amount: 12.00, date: '22 Mar, 2024', status: 'completed' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pagos y Finanzas</h1>
          <p className="text-gray-500">Control de cobros, liquidaciones y saldos</p>
        </div>
        <button className="btn-primary">
          <Wallet className="w-4 h-4" />
          Solicitar Liquidación
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-utility bg-zinc-900 text-white border-zinc-900">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-white/60 uppercase tracking-widest text-right">Saldo Disponible</span>
          </div>
          <h2 className="text-4xl font-light tracking-tight mb-1">$1,240.50</h2>
          <p className="text-sm text-white/40 italic">Dispuesto para transferencia inmediata</p>
        </div>

        <div className="card-utility">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ArrowUpRight className="w-5 h-5 text-zinc-900" />
            </div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest text-right">Cobros del Mes</span>
          </div>
          <h2 className="text-4xl font-light tracking-tight mb-1">$4,812.20</h2>
          <p className="text-sm text-green-500 font-medium">+15.2% vs mes anterior</p>
        </div>

        <div className="card-utility">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Receipt className="w-5 h-5 text-zinc-900" />
            </div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest text-right">Pendiente Liquidación</span>
          </div>
          <h2 className="text-4xl font-light tracking-tight mb-1">$356.10</h2>
          <p className="text-sm text-orange-500 font-medium">4 pedidios por procesar</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl">Transacciones Recientes</h3>
          <button className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Ver historial completo</button>
        </div>

        <div className="card-utility p-0 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {transactions.map((tx, i) => (
              <motion.div 
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    tx.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tx.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{tx.customer}</p>
                    <p className="text-xs text-gray-400">{tx.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-zinc-900' : 'text-gray-500'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </p>
                    <p className={`text-[10px] font-bold uppercase tracking-tighter ${
                      tx.status === 'completed' ? 'text-green-500' : 'text-orange-500'
                    }`}>
                      {tx.status === 'completed' ? 'Completado' : 'Pendiente'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-zinc-900 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
