import { AddToCartResponse } from './../../models/AddToCartResponseModel';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddToCartPayload } from '../../models/cartPayloadModel';
import { Cart } from '../../models/cartModel';
import { CartItem } from '../../models/cartModel';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  items: CartItem[] = [];
  private userId: string = '';
  private apiUrl = 'https://distinzionejoyas.com/api/cart';

  constructor(private http: HttpClient, private router: Router) {}

  addToCart(payload: AddToCartPayload): Observable<AddToCartResponse> {
    return this.http.post<AddToCartResponse>(`${this.apiUrl}/add`, payload);
  }

  getCart(userId: string): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${userId}`);
  }

  deleteByProduct(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/product/${productId}`);
  }

  updateQuantity(payload: AddToCartPayload): Observable<AddToCartResponse> {
    const { userId, productId, quantityChange } = payload;
    return this.http.patch<AddToCartResponse>(
      `${this.apiUrl}/${userId}/product/${productId}`,
      { quantityChange }
    );
  }

  loadCart(userId: string) {
    this.userId = userId;
    this.http.get<{ items: CartItem[] }>(`${this.apiUrl}/${userId}`).subscribe({
      next: (res) => (this.items = res.items),
      error: () => {},
    });
  }

  getItemCount(): number {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  getTotal(): number {
    return this.items.reduce(
      (acc, item) => acc + (item.productId.price || 0) * item.quantity,
      0
    );
  }

  increaseQuantity(item: CartItem): void {
    if (!item.productId._id) return;

    const payload: AddToCartPayload = {
      userId: this.userId,
      productId: item.productId._id,
      quantityChange: 1,
    };

    this.updateQuantity(payload).subscribe({
      next: () => item.quantity++,
      error: () =>
        Swal.fire('Error', 'No se pudo aumentar la cantidad.', 'error'),
    });
  }

  decreaseQuantity(item: CartItem): void {
    if (!item.productId._id) return;

    const payload: AddToCartPayload = {
      userId: this.userId,
      productId: item.productId._id,
      quantityChange: -1,
    };

    this.updateQuantity(payload).subscribe({
      next: () => item.quantity--,
      error: () =>
        Swal.fire('Error', 'No se pudo aumentar la cantidad.', 'error'),
    });
  }

  removeItem(item: CartItem): void {
    Swal.fire({
      title: '¿Eliminar producto del carrito?',
      text: 'Esta acción quitará todos los ítems de este producto del carrito.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d4af37',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const productId = item.productId._id;

        if (!productId) return;

        this.deleteByProduct(this.userId, productId).subscribe({
          next: () => {
            this.items = this.items.filter(
              (i) => i.productId._id !== productId
            );
            Swal.fire(
              '¡Eliminado!',
              'Producto eliminado del carrito.',
              'success'
            );
          },
          error: () =>
            Swal.fire('Error', 'No se pudo eliminar el producto.', 'error'),
        });
      }
    });
  }

  checkout(): void {
    const payloadDraft = {
      items: this.items,
      total: this.getTotal(),
    };

    if (!this.userId || this.items.length === 0) {
      Swal.fire(
        '🛑 Carrito vacío',
        'No hay productos para procesar.',
        'warning'
      );
      return;
    }

    Swal.fire({
      title: 'Confirmar compra',
      text: '¿Querés avanzar con tu pedido?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d4af37',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, continuar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/order-detail'], {
          state: { payloadDraft, userId: this.userId },
        });
      }
    });
  }

  addToCartProduct(productId: string, userId: string): void {
    if (!userId) {
      console.warn('🛑 Usuario no definido. No se puede agregar al carrito.');
      return;
    }
    const payload = { userId, productId, quantityChange: 1 };
    console.log(payload);
    this.addToCart(payload).subscribe({
      next: () => {
        Swal.fire({
          title: '¿Agregar al carrito?',
          text: '¿Deseás añadir este producto?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, agregar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#d4af37',
          cancelButtonColor: '#aaa',
        }).then((result) => {
          if (result.isConfirmed) {
            // ✅ Lógica para agregar al carrito
            Swal.fire({
              icon: 'success',
              title: 'Agregado al carrito',
              text: 'Producto añadido exitosamente',
              confirmButtonColor: '#d4af37',
            });
          }
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'No se pudo agregar al carrito',
          confirmButtonColor: '#d4af37',
        });
      },
    });
  }
}
