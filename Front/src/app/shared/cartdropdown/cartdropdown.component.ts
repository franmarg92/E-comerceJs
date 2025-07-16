import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart.service';
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

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
  const rawUser = localStorage.getItem('user');
  const userId = rawUser ? JSON.parse(rawUser).userId : '';

  if (userId) {
    this.cartService.loadCart(userId);
  }
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
