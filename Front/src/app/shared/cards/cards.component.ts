import { Component, Input, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Product } from '../../models/productModel';
import Swal from 'sweetalert2';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
})
export class CardsComponent {
  @Input() product!: Product;
  currentUserId: string = '';
  isAuthenticated = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.listenAuthStatus();
  }

  private loadUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      const rawUser = localStorage.getItem('user');
      this.currentUserId = rawUser ? JSON.parse(rawUser).userId : '';
    }
  }

    private listenAuthStatus(): void {
    this.authService.user$.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  addToCart(productId: string): void {
    this.cartService.addToCartProduct(productId, this.currentUserId);
  }

  addToCartAnonimous(productId: string): void {
    this.cartService.addToAnonymousCart(productId);
  }


  goToProductDetail(productId?: string): void {
    if (productId) {
      this.router.navigate(['/product-detail', productId]);
    } else {
      console.error('ID de producto inválido');
    }
  }
}
