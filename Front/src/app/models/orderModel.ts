import { CartItem } from "./cartModel";

export interface Order {
  _id?: string; 
  userId: string;
  shippingAddressId: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  notes?: string;
  status?: 'pending'| 'paid'| 'shipped'| 'delivered'| 'cancelled'; 
  createdAt?: string;
  updatedAt?: string;
}