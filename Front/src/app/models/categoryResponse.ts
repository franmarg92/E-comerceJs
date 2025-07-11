import { Category } from "./categoryModel";

export interface CategoryResponse {
  success: boolean;
  message: string;
  categories: Category[];
}