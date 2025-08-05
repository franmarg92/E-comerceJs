export interface Subcategory {
  _id?: string;
  name: string;
  parent: string; // siempre requerido
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}