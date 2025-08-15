import { CartItem } from './cartModel';

export interface Order {
  _id?: string;
  userId: string;
  shippingAddressId: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  notes?: string;
  orderStatus?:
    | 'Pendiente'
    | 'Pagado'
    | 'Entregado '
    | 'En camino'
    | 'Cancelado';
  createdAt?: string;
  updatedAt?: string;
  paymentId?: string;
  paymentStatus?: 'pending' | 'approved' | 'rejected' | 'in_process';
  shippingId?: string;
  shippingProvider?: string;
  shippingDate?: string;
}
