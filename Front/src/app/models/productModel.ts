export interface Variant {
  color?: string;
  size?: string;
  stock?: number;
}

export interface Product {
  _id?: string;
  name: string;
  description?: string;
  image: string[]; // URLs de imágenes
  price: number;
  stock?: number;
  categories?: string[]; // IDs de categoría
  variants?: Variant[];  // Combinaciones de color/talle/stock
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
