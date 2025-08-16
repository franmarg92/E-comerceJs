import { Product } from './productModel';
import { Address } from './addressModel';
export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface OrderWithDetails {
  _id: string;
  userId: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    dni: number;
  };
  notes: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: Address;
  paymentId: string;
  paymentStatus: 'pending' | 'approved' | 'rejected' | 'in_process';
  shippingId?: string;
  shippingProvider: string;
  shippingDate: string;
}
