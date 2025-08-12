export interface OrderData {
  userId: string;
  shippingAddressId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  notes: string;
}