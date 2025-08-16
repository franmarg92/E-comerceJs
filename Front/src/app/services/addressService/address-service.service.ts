import { UserWithPassword } from './../../models/userModel';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Address } from '../../models/addressModel';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AddressServiceService {
  private apiUrl = 'http://localhost:3000/api/address';
  private userId: string = '';
  public addresses$ = new BehaviorSubject<Address[]>([]);
  public  addressesObservable$ = this.addresses$.asObservable();

  constructor(private http: HttpClient) {}
  loadAddresses(userId: string): void {
    this.getAddresses(userId).subscribe((response) => {
      if (response.success) {
        this.addresses$.next(response.addresses);
      }
    });
  }
  ngOnInit(): void {
    const rawUser = localStorage.getItem('user');
    const userId = rawUser ? JSON.parse(rawUser).userId : '';
  }
  createAddress(addressData: Address): Observable<{ success: boolean; address: Address }> {
    return this.http.post<{ success: boolean; address: Address }>(
      `${this.apiUrl}/create-address`,
      addressData
    );
  }

  getAddresses(
    userId: string
  ): Observable<{ success: boolean; addresses: Address[] }> {
    return this.http.get<{ success: boolean; addresses: Address[] }>(
      `${this.apiUrl}/${userId}`
    );
  }

  deleteAddress(addressId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${addressId}`);
  }

  updateAddress(
    addressId: string,
    userId: string,
    data: Partial<Address>
  ): Observable<Address> {
    const payload = { ...data, userId };
    return this.http.patch<Address>(`${this.apiUrl}/edit/${addressId}`, payload);
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
