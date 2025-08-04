import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductUpdatePayload } from '../../models/productModel';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://distinzionejoyas.com/api/product';

  constructor(private http: HttpClient) {}

  editProduct(id: string, productData: FormData): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/edit/${id}`, productData);
  }

  createProduct(productData: FormData): Observable<Product> {
    const form = new FormData();

    return this.http.post<Product>(`${this.apiUrl}/create`, productData);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/`);
  }

  getProductById(id: string): Observable<{ product: Product }> {
    return this.http.get<{ product: Product }>(`${this.apiUrl}/${id}`);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/featured`);
  }

    getPortfolioProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/portfolio`);
  }
}
