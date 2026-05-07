import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Order } from '../types';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'trackingNumber'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ktm_orders');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'ORD-001', trackingNumber: 'KTM-REC-001', customerName: 'Juan Pérez', deliveryAddress: 'Av. Amazonas N22', status: 'pending' as const, amount: 45.00, createdAt: '2024-05-07', updatedAt: '2024-05-07', paymentStatus: 'pending' as const, estimatedDelivery: 'Hoy' },
      { id: 'ORD-002', trackingNumber: 'KTM-REC-002', customerName: 'María López', deliveryAddress: 'Calle Larga 443', status: 'in_transit' as const, amount: 22.50, createdAt: '2024-05-07', updatedAt: '2024-05-07', paymentStatus: 'pending' as const, estimatedDelivery: 'Hoy' },
      { id: 'ORD-003', trackingNumber: 'KTM-REC-003', customerName: 'Roberto Diaz', deliveryAddress: 'Pje. Los Pinos', status: 'delivered' as const, amount: 67.00, createdAt: '2024-05-06', updatedAt: '2024-05-06', paymentStatus: 'paid' as const, estimatedDelivery: 'Ayer' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('ktm_orders', JSON.stringify(orders));
    
    // Sync with Google Sheets
    const syncWithSheets = async () => {
      try {
        await fetch('/api/sync/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orders)
        });
      } catch (err) {
        console.error('Failed to sync orders with sheets:', err);
      }
    };
    
    const timeoutId = setTimeout(syncWithSheets, 2000); // Debounce sync
    return () => clearTimeout(timeoutId);
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'trackingNumber'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(Math.random() * 900) + 100}`,
      trackingNumber: `KTM-REC-${Math.floor(Math.random() * 9000) + 1000}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
}
