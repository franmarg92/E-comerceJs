import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart.service';
import { ProductService } from '../../services/product/product.service';
import { CartItem } from '../../models/cartModel';

@Component({
  selector: 'app-cartdropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cartdropdown.component.html',
  styleUrl: './cartdropdown.component.css',
})
export class CartdropdownComponent {
  @Output() closeDropdown = new EventEmitter<void>();
  items: CartItem[] = [];
  constructor(public cartService: CartService, public productService: ProductService) {}

  ngOnInit(): void {

    this.productService.getAllProducts().subscribe((products) => {
  this.cartService.setProductCatalog(products); // precarga catálogo
  this.cartService.loadCart(); // carga el carrito según userId
});
    const rawUser = localStorage.getItem('user');
    const userId = rawUser ? JSON.parse(rawUser).userId : '';

    // Cargar el carrito según si está logueado o no
    this.cartService.loadCart(userId || undefined);

    // Suscribirse a los items reactivos
    this.cartService.items$.subscribe((items) => {
      this.items = items;
    });
  }

  increase(item: CartItem) {
    this.cartService.increaseQuantity(item);
  }

  decrease(item: CartItem) {
    this.cartService.decreaseQuantity(item);
  }

  remove(item: CartItem) {
    this.cartService.removeItem(item);
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  checkout() {
    this.cartService.checkout();
  }
}
