export interface Category {
  _id?: string;
  name: string;
  description?: string;
  parent?: string; // ID de la categoría padre
  image?: string;  // URL de imagen
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface CategoryWithParent extends Category {
  parentCategory?: Category;
}