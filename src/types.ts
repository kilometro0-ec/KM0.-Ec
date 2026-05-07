export type UserRole = 'admin' | 'tienda' | 'motorizado' | 'vendedor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  joinedAt: string;
  parentId?: string; // For vendors belonging to a tienda
}

export interface LogisticsConfig {
  clientFee: number;
  riderPay: number;
}

export interface StockItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  status: 'sent' | 'received' | 'discrepancy';
  shopId: string;
  sentAt: string;
  receivedAt?: string;
  verifiedBy?: string;
}

export type OrderStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled' | 'on_hold';

export interface Order {
  id: string;
  trackingNumber: string;
  customerName: string;
  deliveryAddress: string;
  status: OrderStatus;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  amount: number;
  riderId?: string;
  riderName?: string;
  phone?: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'alert';
  timestamp: string;
}

export interface Stats {
  totalOrders: number;
  activeDeliveries: number;
  deliveredToday: number;
  pendingPayments: number;
}
