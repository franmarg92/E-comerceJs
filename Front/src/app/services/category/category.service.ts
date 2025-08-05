import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryResponse } from '../../models/categoryResponse';
import { Category } from '../../models/categoryModel';
import { Subcategory } from '../../models/subcategoryModel';


@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'https://distinzionejoyas.com/api/category';

  constructor(private http: HttpClient) {}

  createCategory(categoryData: Category): Observable<Category> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Category>(
      `${this.apiUrl}/create`,
       categoryData ,
      { headers }
    );
  }

  getAllCategory(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(`${this.apiUrl}/`);
  }

  getSubcategories(parentId: string): Observable<{ success: boolean; subcategories: Subcategory[] }> {
  return this.http.get<{ success: boolean; subcategories: Subcategory[] }>(`${this.apiUrl}/${parentId}/subcategories`);
}

}
