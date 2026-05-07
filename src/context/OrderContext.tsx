import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Order } from '../types';
import { useNotifications } from './NotificationContext';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'trackingNumber'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  restoreOrder: (id: string) => void;
  permanentlyDeleteOrder: (id: string) => void;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const { notify } = useNotifications();
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('km0_orders');
    if (saved) {
      const parsedOrders = JSON.parse(saved);
      // Clean up old trash on load
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      return parsedOrders.filter((order: Order) => {
        if (!order.isDeleted || !order.deletedAt) return true;
        return new Date(order.deletedAt) > thirtyDaysAgo;
      });
    }
    return [
      { id: 'ORD-001', trackingNumber: 'KM0-REC-001', customerName: 'Juan Pérez', deliveryAddress: 'Av. Amazonas N22', status: 'pending' as const, amount: 45.00, createdAt: '2024-05-07', updatedAt: '2024-05-07', paymentStatus: 'pending' as const, estimatedDelivery: 'Hoy' },
      { id: 'ORD-002', trackingNumber: 'KM0-REC-002', customerName: 'María López', deliveryAddress: 'Calle Larga 443', status: 'in_transit' as const, amount: 22.50, createdAt: '2024-05-07', updatedAt: '2024-05-07', paymentStatus: 'pending' as const, estimatedDelivery: 'Hoy' },
      { id: 'ORD-003', trackingNumber: 'KM0-REC-003', customerName: 'Roberto Diaz', deliveryAddress: 'Pje. Los Pinos', status: 'delivered' as const, amount: 67.00, createdAt: '2024-05-06', updatedAt: '2024-05-06', paymentStatus: 'paid' as const, estimatedDelivery: 'Ayer' },
    ];
  });

  const syncWithSheets = async (ordersToSync: Order[]) => {
    try {
      const response = await fetch('/api/sync/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ordersToSync.filter(o => !o.isDeleted))
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Server error during sync');
      }
      console.log('Orders synced with sheets');
    } catch (err: any) {
      console.error('Failed to sync orders with sheets:', err);
      notify('Error de Sincronización', `No se pudo enviar los pedidos a Google Sheets: ${err.message}`, 'alert' as any);
    }
  };

  useEffect(() => {
    localStorage.setItem('km0_orders', JSON.stringify(orders));
    
    const timeoutId = setTimeout(() => syncWithSheets(orders), 2000); // Debounce sync
    return () => clearTimeout(timeoutId);
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'trackingNumber'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(Math.random() * 900) + 100}`,
      trackingNumber: `KM0-REC-${Math.floor(Math.random() * 9000) + 1000}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : o));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { 
      ...o, 
      isDeleted: true, 
      deletedAt: new Date().toISOString() 
    } : o));
    notify('Pedido eliminado', 'El pedido ha sido movido a la papelera por 30 días.', 'info');
  };

  const restoreOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { 
      ...o, 
      isDeleted: false, 
      deletedAt: undefined 
    } : o));
    notify('Pedido restaurado', 'El pedido ha sido restaurado exitosamente.', 'info');
  };

  const permanentlyDeleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    notify('Pedido borrado', 'El pedido ha sido eliminado permanentemente.', 'alert');
  };

  const refreshOrders = async () => {
    // In a real app, this would fetch from a server. 
    // Here we just trigger a re-sync and notify.
    await syncWithSheets(orders);
    notify('Datos actualizados', 'La información ha sido refrescada con el servidor.', 'info');
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      addOrder, 
      updateOrder, 
      deleteOrder, 
      restoreOrder, 
      permanentlyDeleteOrder,
      refreshOrders 
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
}
