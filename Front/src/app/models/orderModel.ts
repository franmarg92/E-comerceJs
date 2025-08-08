import { CartItem } from "./cartModel";

export interface Order {
  _id?: string; 
  userId: string;
  shippingAddressId: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  notes?: string;
  status?: 'Pendiente'| 'Pagado'| 'Entregado '| 'En camino'| 'Cancelado'; 
  createdAt?: string;
  updatedAt?: string;
}