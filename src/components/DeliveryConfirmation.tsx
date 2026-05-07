import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, PenTool, CheckCircle2, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface DeliveryConfirmationProps {
  order: { id: string; trackingNumber: string; customerName: string };
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeliveryConfirmation({ order, onConfirm, onClose }: DeliveryConfirmationProps) {
  const [step, setStep] = useState<'options' | 'photo' | 'signature' | 'success'>('options');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalConfirm = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      setTimeout(() => {
        onConfirm();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="font-bold text-lg text-zinc-900">Confirmar Entrega</h3>
            <p className="text-xs text-gray-500 font-mono">{order.trackingNumber} • {order.customerName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'options' && (
              <motion.div 
                key="options"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-sm text-gray-600 mb-6">Por favor, adjunta una prueba de entrega para finalizar el pedido:</p>
                
                <button 
                  onClick={() => setStep('photo')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    hasPhoto ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${hasPhoto ? 'bg-green-500 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                      <Camera className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Foto del Paquete</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Recomendado</p>
                    </div>
                  </div>
                  {hasPhoto ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <ChevronRight className="w-5 h-5 text-gray-300" />}
                </button>

                <button 
                  onClick={() => setStep('signature')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    hasSignature ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${hasSignature ? 'bg-green-500 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                      <PenTool className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Firma del Receptór</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Opcional</p>
                    </div>
                  </div>
                  {hasSignature ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <ChevronRight className="w-5 h-5 text-gray-300" />}
                </button>

                <button 
                  disabled={!hasPhoto || isSubmitting}
                  onClick={handleFinalConfirm}
                  className="w-full btn-primary h-14 mt-8 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-xl shadow-zinc-200"
                >
                  {isSubmitting ? 'Procesando...' : 'Finalizar Entrega'}
                </button>
              </motion.div>
            )}

            {step === 'photo' && (
              <motion.div 
                key="photo"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="aspect-square bg-zinc-100 rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
                  {hasPhoto ? (
                    <div className="absolute inset-0 bg-zinc-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <p className="text-white font-bold text-sm">Cambiar Foto</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-white rounded-full shadow-lg">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-400 font-medium">Pulsa para abrir la cámara</p>
                    </>
                  )}
                  {hasPhoto && <div className="absolute inset-0 bg-green-500/10" />}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep('options')} className="flex-1 btn-secondary py-4 text-sm font-bold">Atrás</button>
                  <button onClick={() => { setHasPhoto(true); setStep('options'); }} className="flex-1 btn-primary py-4 text-sm font-bold">Capturar Foto</button>
                </div>
              </motion.div>
            )}

            {step === 'signature' && (
              <motion.div 
                key="signature"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="h-48 bg-gray-50 rounded-2xl border border-gray-200 relative flex items-center justify-center">
                   <p className="text-xs text-gray-300 font-medium italic">Espacio para firma digital del cliente</p>
                   <PenTool className="absolute bottom-4 right-4 text-gray-200 w-8 h-8" />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep('options')} className="flex-1 btn-secondary py-4 text-sm font-bold">Atrás</button>
                  <button onClick={() => { setHasSignature(true); setStep('options'); }} className="flex-1 btn-primary py-4 text-sm font-bold">Guardar Firma</button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                  <CheckCircle2 className="text-white w-12 h-12" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-zinc-900">¡Entrega Confirmada!</h4>
                  <p className="text-gray-500">El estado se ha actualizado en tiempo real</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center gap-2">
           <ShieldCheck className="w-3 h-3 text-zinc-400" />
           <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Verificado por LogiDash Pro v2</span>
        </div>
      </motion.div>
    </div>
  );
}

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
