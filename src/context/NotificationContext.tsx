import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, AlertTriangle, Info, X } from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  title: string;
  content: string;
  variant: 'warning' | 'info' | 'success';
}

interface NotificationContextType {
  requestPermission: () => Promise<void>;
  permission: NotificationPermission;
  notify: (title: string, body: string, variant?: 'success' | 'info' | 'warning') => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [toasts, setToasts] = useState<Notification[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const notify = (title: string, content: string, variant: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, content, variant, type: 'alert' }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const requestPermission = async () => {
    if (typeof window !== 'undefined') {
      if ('Notification' in window) {
        try {
          const result = await Notification.requestPermission();
          setPermission(result);
        } catch (e) {
          setPermission('granted'); // Fallback for prototype
        }
      } else {
        setPermission('granted'); // Simulation fallback
      }
    }
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    // Connect to SSE
    const eventSource = new EventSource('/api/notifications/stream');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'news_alert') {
        // 1. Show Browser Notification if permitted
        if (Notification.permission === 'granted') {
          new Notification(data.title, {
            body: data.content,
            icon: '/favicon.ico' // Or a local icon
          });
        }

        // 2. Add to internal Toasts
        const newNotification = {
          id: data.id,
          type: data.type,
          title: data.title,
          content: data.content,
          variant: data.variant || 'info'
        };
        
        setToasts(prev => [...prev, newNotification]);

        // Auto-remove toast after 10s
        setTimeout(() => {
          removeToast(data.id);
        }, 10000);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE Error:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ requestPermission, permission, notify }}>
      {children}
      
      {/* Toast Overlay */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 min-w-[320px] max-w-[400px]">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
              className={`p-4 rounded-xl shadow-2xl border flex gap-4 bg-white ${
                toast.variant === 'warning' ? 'border-orange-100' : 
                toast.variant === 'success' ? 'border-green-100' : 'border-blue-100'
              }`}
            >
              <div className={`p-2 rounded-lg h-fit ${
                toast.variant === 'warning' ? 'bg-orange-50 text-orange-600' : 
                toast.variant === 'success' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {toast.variant === 'warning' ? <AlertTriangle className="w-5 h-5" /> : 
                 toast.variant === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-zinc-900">{toast.title}</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{toast.content}</p>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-gray-100 rounded-lg h-fit text-gray-400 hover:text-zinc-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
