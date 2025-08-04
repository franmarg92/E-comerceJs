export interface Variant {
  color?: string;
  size?: string;
  stock?: number;
}

export interface Product {
  _id?: string;
  articleCode: string;
  name: string;
  description?: string;
  image: string[]; // URLs de imágenes
  price: number;
  cost?:number;
  stock?: number;
  categories?: string[]; // IDs de categoría
  subcategories?: string[];
  variants?: Variant[];  // Combinaciones de color/talle/stock
  isActive?: boolean;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;

}


export interface ProductUpdatePayload {
  name?: string;
  articleCode?: string;
  description?: string;
  image?: string[];
  price?: number;
  cost?:number;
  stock?: number;
  isActive?: boolean;
  featured?: boolean;
  categories?: string[];
  subcategories?: string[];
  variants?: Variant[];
}