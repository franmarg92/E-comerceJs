import { AddToCartResponse } from './../../models/AddToCartResponseModel';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap, of, catchError } from 'rxjs';
import { AddToCartPayload } from '../../models/cartPayloadModel';
import { Cart } from '../../models/cartModel';
import { CartItem } from '../../models/cartModel';
import Swal from 'sweetalert2';
import { Product } from '../../models/productModel';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../models/userModel';
import { ProductService } from '../product/product.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  items: CartItem[] = [];
  private productCatalog: Product[] = [];
  private userId: string = '';

  private readonly ANON_KEY = 'anonymousCart';
  private apiUrl = 'https://distinzionejoyas.com/api/cart';

  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Consumo de apis

  addToCart(payload: AddToCartPayload): Observable<AddToCartResponse> {
    return this.http
      .post<AddToCartResponse>(`${this.apiUrl}/add`, payload)
      .pipe(
        tap({
          next: () => this.refreshCart(payload.userId),
          error: () => console.warn('🛑 Error al agregar al carrito.'),
        })
      );
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

  mergeCart(payload: { userId: string; items: CartItem[] }): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/merge`, payload);
  }

  clearCart(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear/${userId}`).pipe(
      tap(() => {
        this.items = [];
        this.itemsSubject.next([]);
      })
    );
  }

  // comienzo de funciones

  private refreshCart(userId?: string): void {
    if (!userId) {
      this.updateAnonymousCartSubject();
      return;
    }

    this.getCart(userId).subscribe({
      next: (cart) => this.itemsSubject.next(cart.items),
      error: () => console.warn('🛑 No se pudo cargar el carrito del usuario.'),
    });
  }

  private updateUserCartSubject(): void {
    this.itemsSubject.next(this.items);
  }

  loadCartFromBackend(userId: string): void {
    this.refreshCart(userId);
  }

  private updateAnonymousCartSubject(): void {
    if (!this.productCatalog.length) {
      return;
    }

    const anonymousItems = this.getAnonymousCart();
    this.itemsSubject.next(anonymousItems);
  }

  loadCart(userId?: string): void {
    if (!userId) {
      this.items = this.getAnonymousCart();
      this.updateAnonymousCartSubject();
    } else {
      this.userId = userId;
      this.http
        .get<{ items: CartItem[] }>(`${this.apiUrl}/${userId}`)
        .subscribe({
          next: (res) => {
            this.items = res.items;
            this.updateUserCartSubject();
          },
          error: () => {},
        });
    }
  }

  getItemCount(): Observable<number> {
    return this.items$.pipe(
      map((items) => items.reduce((acc, item) => acc + item.quantity, 0))
    );
  }

  getTotal(): number {
    return this.items.reduce(
      (acc, item) => acc + (item.productId.price || 0) * item.quantity,
      0
    );
  }

  getCartTotal = (cart: {
    items: { productId: { price?: number }; quantity: number }[];
  }): number => {
    if (!cart || !Array.isArray(cart.items)) return 0;

    return cart.items.reduce((acc, item) => {
      const price = item.productId?.price ?? 0;
      return acc + price * item.quantity;
    }, 0);
  };

  private syncAnonymousCart(updatedItem: CartItem): void {
    const raw = localStorage.getItem(this.ANON_KEY);
    const simpleCart = raw ? JSON.parse(raw) : [];

    const index = simpleCart.findIndex(
      (item: any) => item.productId === updatedItem.productId._id
    );

    if (index > -1) {
      simpleCart[index].quantity = updatedItem.quantity;
      localStorage.setItem(this.ANON_KEY, JSON.stringify(simpleCart));
    }
  }


increaseQuantity(item: CartItem): void {
  const productId = item.productId._id;
  const stock = item.productId.stock;

  if (!productId) return;

  // 🔒 Validación de stock
  if (stock === undefined) {
    Swal.fire('🚫 Stock no disponible', 'No se pudo verificar el stock del producto.', 'warning');
    return;
  }
  if (item.quantity >= stock) {
    Swal.fire('🚫 Stock máximo alcanzado', `Solo hay ${stock} unidades disponibles`, 'warning');
    return;
  }

  if (!this.userId) {
    item.quantity++;
    this.syncAnonymousCart(item);
    this.updateAnonymousCartSubject();
    return;
  }

  const payload: AddToCartPayload = {
    userId: this.userId,
    productId,
    quantityChange: 1,
  };

  this.updateQuantity(payload).subscribe({
    next: () => {
      item.quantity++;
      this.updateUserCartSubject();
    },
    error: (err) => {
      Swal.fire('❌ Error', err.error?.message || 'No se pudo aumentar la cantidad.', 'error');
    },
  });
}

  decreaseQuantity(item: CartItem): void {
    const productId = item.productId._id;
    if (!productId || item.quantity <= 1) return;

    if (!this.userId) {
      // 🧠 Anónimo
      item.quantity--;
      this.syncAnonymousCart(item);
      this.updateAnonymousCartSubject();
      return;
    }

    const payload: AddToCartPayload = {
      userId: this.userId,
      productId,
      quantityChange: -1,
    };

    this.updateQuantity(payload).subscribe({
      next: () => {
        item.quantity--;
        this.updateUserCartSubject();
      },
      error: () =>
        Swal.fire('Error', 'No se pudo disminuir la cantidad.', 'error'),
    });
  }

  removeItem(item: CartItem): void {
    const productId = item.productId._id;
    if (!productId) return;

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
      if (!result.isConfirmed) return;

      if (!this.userId) {
        // 🧠 Anónimo
        const raw = localStorage.getItem(this.ANON_KEY);
        const simpleCart = raw ? JSON.parse(raw) : [];
        const updated = simpleCart.filter(
          (i: any) => i.productId !== productId
        );
        localStorage.setItem(this.ANON_KEY, JSON.stringify(updated));
        this.updateAnonymousCartSubject();

        Swal.fire('¡Eliminado!', 'Producto eliminado del carrito.', 'success');
        return;
      }

      // 🔐 Logueado
      this.deleteByProduct(this.userId, productId).subscribe({
        next: () => {
          this.items = this.items.filter((i) => i.productId._id !== productId);
          this.updateUserCartSubject();
          Swal.fire(
            '¡Eliminado!',
            'Producto eliminado del carrito.',
            'success'
          );
        },
        error: () =>
          Swal.fire('Error', 'No se pudo eliminar el producto.', 'error'),
      });
    });
  }

  getUserId(): string | null {
    if (!this.isBrowser()) return null;

    const raw = localStorage.getItem('user');
    try {
      const user = raw ? JSON.parse(raw) : null;
      return user?.userId || null;
    } catch {
      return null;
    }
  }

  //Finalizar compra

  checkout(): void {
    const isAnonymous = !this.userId;

    if (this.items.length === 0) {
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
      if (!result.isConfirmed) return;

      if (isAnonymous) {
        this.router.navigate(['/account'], {
          queryParams: { redirect: 'checkout' },
        });
      } else {
        this.router.navigate(['/order-detail'], {});
      }
    });
  }

  addToCartProduct(productId: string, userId: string): void {
    if (!userId) {
      console.warn('🛑 Usuario no definido. No se puede agregar al carrito.');
      return;
    }

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
        const payload = { userId, productId, quantityChange: 1 };

        this.addToCart(payload).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Agregado al carrito',
              text: 'Producto añadido exitosamente',
              confirmButtonColor: '#d4af37',
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
    });
  }

  setProductCatalog(products: Product[]): void {
    this.productCatalog = products;
    this.updateAnonymousCartSubject();
  }

  addToAnonymousCart(productId: string): void {
    const raw = localStorage.getItem(this.ANON_KEY);
    const cart: { productId: string; quantity: number }[] = raw
      ? JSON.parse(raw)
      : [];

    const index = cart.findIndex((item) => item.productId === productId);

    if (index > -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ productId, quantity: 1 });
    }

    localStorage.setItem(this.ANON_KEY, JSON.stringify(cart));

    // 🧠 Verificamos si el catálogo está listo
    if (!this.productCatalog.length) {
      this.productService.getAllProducts().subscribe((products) => {
        this.setProductCatalog(products); // esto ya llama a updateAnonymousCartSubject()
      });
    } else {
      this.updateAnonymousCartSubject();
    }

    Swal.fire({
      icon: 'success',
      title: 'Producto guardado',
      text: 'Se ha agregado como invitado.',
      confirmButtonColor: '#d4af37',
    });
  }

  getAnonymousCart(): CartItem[] {
    if (!this.isBrowser()) {
      return [];
    }

    const raw = localStorage.getItem('anonymousCart');
    const simpleCart: { productId: string; quantity: number }[] = raw
      ? JSON.parse(raw)
      : [];

    return simpleCart
      .map(({ productId, quantity }) => {
        const product = this.productCatalog.find((p) => p._id === productId);
        return product ? { productId: product, quantity } : null;
      })
      .filter((item): item is CartItem => item !== null);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  mergeAnonymousCart(userId: string): Observable<void> {
    if (!isPlatformBrowser(this.platformId)) return of(undefined);

    const rawCart = localStorage.getItem('anonymousCart');

    let items: any[] = [];

    try {
      items = JSON.parse(rawCart || '[]');
    } catch (err) {
      return of(undefined);
    }

    if (!items.length) {
      return of(undefined);
    }

    const payload = { userId, items };

    return this.mergeCart(payload).pipe(
      tap(() => {
        localStorage.removeItem('anonymousCart');
        this.refreshCart(userId);
      }),
      catchError((err) => {
        return of(undefined);
      }),
      map(() => undefined)
    );
  }
}
