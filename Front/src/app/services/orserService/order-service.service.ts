import { Order } from './../../models/orderModel';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderWithDetails } from '../../models/OrderWhitDetails';
@Injectable({
  providedIn: 'root',
})
export class OrderServiceService {
  private apiUrl = 'http://localhost:3000/api/order';
  constructor(private http: HttpClient) {}

  createOrder(dataOrder: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/create-order`, dataOrder);
  }

  getAllOrder(): Observable<{ orders: OrderWithDetails[] }> {
    return this.http.get<{ success: boolean; orders: OrderWithDetails[] }>(
      `${this.apiUrl}/all-order`
    );
  }

  getOrderById(id: string): Observable<{ order: Order }> {
    return this.http.get<{ order: Order }>(`${this.apiUrl}/${id}`);
  }

  getOrderByUserId(
    userId: string
  ): Observable<{ success: boolean; orders: OrderWithDetails[] }> {
    return this.http.get<{ success: boolean; orders: OrderWithDetails[] }>(
      `${this.apiUrl}/orderbyuser/${userId}`
    );
  }

  updateOrderStatus(
    orderId: string,
    status: string
  ): Observable<OrderWithDetails> {
    const body = { status };

    return this.http.patch<OrderWithDetails>(
      `${this.apiUrl}/update-order/${orderId}`,
      body
    );
  }
}
