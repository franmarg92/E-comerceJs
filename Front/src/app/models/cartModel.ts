import { Product } from "./productModel";
export interface CartItem {
  productId: Product;  
  quantity: number;
}

export interface Cart {
  _id?: string;
  userId?: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}