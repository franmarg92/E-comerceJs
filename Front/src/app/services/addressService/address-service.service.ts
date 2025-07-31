import { UserWithPassword } from './../../models/userModel';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../../models/addressModel';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root',
})
export class AddressServiceService {
  private apiUrl = 'https://distinzionejoyas.com/api/address';
  private userId: string = '';

 

  constructor(private http: HttpClient) {
   
  }


    ngOnInit(): void {
  const rawUser = localStorage.getItem('user');
  const userId = rawUser ? JSON.parse(rawUser).userId : '';

  
}
  createAddress(addressData: Address): Observable<Address> {
    
    return this.http.post<Address>(`${this.apiUrl}/create-address`, addressData);
  }

  getAddresses(userId: string): Observable<{ success: boolean; addresses: Address[] }> {
  return this.http.get<{ success: boolean; addresses: Address[] }>(`${this.apiUrl}/${userId}`);
}


  deleteAddress(addressId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${addressId}`);
  }

  updateAddress(addressId: string, data: Partial<Address>): Observable<Address> {
    return this.http.patch<Address>(`${this.apiUrl}/${addressId}`, data);
  }

  confirmSave(): void {
    Swal.fire({
      icon: 'success',
      title: 'Dirección guardada',
      text: 'Tu domicilio fue registrado exitosamente.',
      confirmButtonColor: '#d4af37',
    });
  }

  confirmDelete(): void {
    Swal.fire({
      icon: 'success',
      title: 'Dirección eliminada',
      text: 'Tu domicilio fue quitado correctamente.',
      confirmButtonColor: '#d4af37',
    });
  }
}


