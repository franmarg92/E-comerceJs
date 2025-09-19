import { Component, Inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { AuthService } from '../../services/auth/auth.service';
import { Product } from '../../models/productModel';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart/cart.service';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product: Product | null = null;
  currentUserId: string = '';
  isAuthenticated = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe({
  next: (res) => {
    console.log('🛬 Respuesta del backend:', res);
    this.product = res.product;
  },
  error: (err) => console.error('Error al cargar producto', err)
});
    }

    if (isPlatformBrowser(this.platformId)) {
      const rawUser = localStorage.getItem('user');
      this.currentUserId = rawUser ? JSON.parse(rawUser).userId : '';
    }

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

  


}
