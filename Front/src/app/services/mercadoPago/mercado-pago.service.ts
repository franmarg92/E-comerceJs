import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Order } from '../../models/orderModel';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
private apiUrl = 'https://distinzionejoyas.com/api/mercadoPago';
  constructor(private http:HttpClient) { }

createPreference(data: Order): Observable<string> {
  return this.http.post<{ url: string }>(`${this.apiUrl}/create-preference`, data)
    .pipe(map(res => res.url));
}

}
