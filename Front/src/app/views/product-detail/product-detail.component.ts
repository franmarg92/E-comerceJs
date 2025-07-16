import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/productModel';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart/cart.service';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product: Product | null = null;
  currentUserId: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
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
  }

  addToCart(): void {
    if (!this.product?._id || !this.currentUserId) return;
    this.cartService.addToCartProduct(this.product._id, this.currentUserId);
  }


}
