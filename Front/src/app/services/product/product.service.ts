import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/productModel';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/product';

  constructor(private http: HttpClient) {}

  editProduct(productData: Product): Observable<Product> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put<Product>(`${this.apiUrl}/edit`, productData, {
      headers,
    });
  }

  createProduct(productData: Product): Observable<Product> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<Product>(
      `${this.apiUrl}/create`,
      { product: productData },
      { headers }
    );
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/`);
  }

  getProductById(id: string): Observable<{ product: Product }> {
  return this.http.get<{ product: Product }>(`${this.apiUrl}/${id}`);
}
}
