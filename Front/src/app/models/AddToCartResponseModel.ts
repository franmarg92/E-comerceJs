import { Cart } from "./cartModel";

export interface AddToCartResponse {
  success: boolean;
  cart?: Cart;
  error?: string;
}