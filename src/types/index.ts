// Core types for Detail Soluções CRM

export interface Company {
  id: string;
  name: string;
  whatsapp: string;
  deliveryFee: number;
  minOrderValue: number;
  openingHours: string;
  logoUrl?: string;
  customName?: string;
  active: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: 'admin' | 'attendant';
  createdAt: string;
}

export interface Customer {
  id: string;
  companyId: string;
  name: string;
  whatsapp: string;
  address: string;
  notes?: string;
  lastOrderDate?: string;
  totalSpent: number;
  orderCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  companyId: string;
  name: string;
  order: number;
  active: boolean;
}

export interface Product {
  id: string;
  companyId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  active: boolean;
  extras?: ProductExtra[];
  createdAt: string;
}

export interface ProductExtra {
  id: string;
  name: string;
  price: number;
}

export type OrderStatus = 
  | 'recebido' 
  | 'em_preparo' 
  | 'pronto' 
  | 'entregue' 
  | 'cancelado';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  extras?: { name: string; price: number }[];
  subtotal: number;
}

export interface Order {
  id: string;
  companyId: string;
  customerId: string;
  customerName: string;
  customerWhatsapp: string;
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  status: OrderStatus;
  paymentMethod: 'pix' | 'dinheiro' | 'cartao' | 'pendente';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  ordersToday: number;
  revenueToday: number;
  ordersByStatus: Record<OrderStatus, number>;
  topProducts: { productName: string; quantity: number }[];
  returningCustomers: number;
}
