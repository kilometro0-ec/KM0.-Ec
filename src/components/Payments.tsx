import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Wallet, Receipt, ChevronRight, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotifications } from '../context/NotificationContext';

export default function Payments() {
  const { notify } = useNotifications();
  const [showSettlement, setShowSettlement] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('km0_payments');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, type: 'income', customer: 'Juan Pérez', amount: 15.50, date: '24 Mar, 2024', status: 'completed' },
      { id: 2, type: 'income', customer: 'Restaurante El Sol', amount: 84.10, date: '23 Mar, 2024', status: 'pending' },
      { id: 3, type: 'payout', customer: 'Liquidación Semanal', amount: 450.00, date: '22 Mar, 2024', status: 'completed' },
      { id: 4, type: 'income', customer: 'María García', amount: 12.00, date: '22 Mar, 2024', status: 'completed' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('km0_payments', JSON.stringify(transactions));

    const syncWithSheets = async () => {
      try {
        const response = await fetch('/api/sync/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactions)
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Server error during sync');
        }
      } catch (err: any) {
        console.error('Failed to sync payments with sheets:', err);
        notify('Error de Sincronización', `No se pudo enviar las transacciones a Google Sheets: ${err.message}`, 'alert' as any);
      }
    };
    
    const timeoutId = setTimeout(syncWithSheets, 2000);
    return () => clearTimeout(timeoutId);
  }, [transactions]);

  const [showHistory, setShowHistory] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  const handleRequestSettlement = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      notify('Liquidación Solicitada', 'Tu solicitud está siendo procesada por tesorería.', 'success');
      
      const newTx = {
        id: Date.now(),
        type: 'payout',
        customer: 'Liquidación KM0-FND',
        amount: 1240.50,
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'pending'
      };
      setTransactions([newTx, ...transactions]);

      setTimeout(() => {
        setSuccess(false);
        setShowSettlement(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b-2 border-km0-orange pb-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-km0-black">Finanzas & <span className="text-km0-orange">Pagos</span></h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 px-1">Control de tesorería y saldos de red</p>
        </div>
        <button 
          onClick={() => setShowSettlement(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Wallet className="w-5 h-5" />
          Solicitar Liquidación
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-utility bg-km0-black text-white border-zinc-900 border-b-4 border-b-km0-orange">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/10 rounded-2xl">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-right">Saldo Disponible</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter mb-1">$1,240.50</h2>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Fondos consolidados Kilometro 0</p>
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
          <button 
            onClick={() => setShowHistory(true)}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Ver historial completo
          </button>
        </div>

        <div className="card-utility p-0 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {transactions.map((tx, i) => (
              <motion.div 
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
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

      <AnimatePresence>
        {showSettlement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettlement(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white rounded-[40px] overflow-hidden shadow-2xl relative z-50"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-orange-50 rounded-[30px] flex items-center justify-center text-km0-orange mx-auto mb-6 shadow-xl shadow-orange-500/10">
                   <Wallet className="w-10 h-10" />
                </div>
                
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-km0-black leading-none">Solicitud de <span className="text-km0-orange">Liquidación</span></h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3 px-6">¿Deseas transferir el saldo disponible a tu cuenta bancaria registrada?</p>

                <div className="my-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Monto a Liquidar</p>
                  <p className="text-4xl font-black italic text-km0-black uppercase tracking-tighter">$1,240.50</p>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    disabled={isProcessing || success}
                    onClick={handleRequestSettlement}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${
                      success ? 'bg-green-500 text-white shadow-xl shadow-green-500/20' : 'btn-primary'
                    }`}
                  >
                    {isProcessing ? 'Procesando...' : success ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Solicitud Enviada
                      </>
                    ) : 'CONFIRMAR TRANSFERENCIA'}
                  </button>
                  <button 
                    onClick={() => setShowSettlement(false)}
                    className="w-full py-5 bg-gray-50 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(showHistory || selectedTx) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowHistory(false); setSelectedTx(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-[40px] overflow-hidden shadow-2xl relative z-50"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-km0-black leading-none">
                      {selectedTx ? 'Detalle de <span className="text-km0-orange">Transacción</span>' : 'Historial <span className="text-km0-orange">Completo</span>'}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 px-1">Registros contables auditados</p>
                  </div>
                  <button onClick={() => { setShowHistory(false); setSelectedTx(null); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2">
                  {(selectedTx ? [selectedTx] : transactions).map((tx) => (
                    <div key={tx.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                           {tx.type === 'income' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-black italic uppercase text-km0-black">{tx.customer}</p>
                          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{tx.date} • ID: {tx.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-black italic tracking-tighter ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </p>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${tx.status === 'completed' ? 'bg-black text-white' : 'bg-orange-500 text-white'}`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => { setShowHistory(false); setSelectedTx(null); }}
                  className="w-full mt-8 py-4 bg-gray-100 text-km0-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-colors"
                >
                  Cerrar Vista
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
