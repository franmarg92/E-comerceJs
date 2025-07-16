import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/categoryModel';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/productModel';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { CartItem } from '../../models/cartModel';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent {
  availableCategories: Category[] = [];
  availableProducts: Product[] = [];
  filteredProducts: Product[] = [];
  currentUserId: string = '';
  isAuthenticated = false;
  items: CartItem[] = [];
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.categoryService.getAllCategory().subscribe((res: any) => {
      this.availableCategories = Array.isArray(res.categories)
        ? res.categories
        : [];
    });

    if (isPlatformBrowser(this.platformId)) {
      const rawUser = localStorage.getItem('user');
      this.currentUserId = rawUser ? JSON.parse(rawUser).userId : '';
    }

    this.productService.getAllProducts().subscribe((res: any) => {
      const products = Array.isArray(res) ? res : [];
      this.availableProducts = products;
      this.filteredProducts = products;
    });

    this.authService.user$.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }
  filterByCategory(catId: string | null | undefined): void {
    if (!catId) {
      this.filteredProducts = this.availableProducts;
      return;
    }

    this.filteredProducts = this.availableProducts.filter((product) =>
      product.categories?.includes(catId)
    );
  }

addToCart(productId: string): void {
  this.cartService.addToCartProduct(productId, this.currentUserId);
}

  addToAnonymousCart(productId: string): void {
    const raw = localStorage.getItem('anonymousCart');
    const cart: { productId: string; quantity: number }[] = raw
      ? JSON.parse(raw)
      : [];

    const index = cart.findIndex((item) => item.productId === productId);

    if (index > -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ productId, quantity: 1 });
    }

    localStorage.setItem('anonymousCart', JSON.stringify(cart));

    Swal.fire({
      icon: 'success',
      title: 'Producto guardado',
      text: 'Se ha agregado como invitado.',
      confirmButtonColor: '#d4af37',
    });
  }

  goToProductDetail(productId?: string): void {
    if (productId) {
      this.router.navigate(['/product-detail', productId]);
    } else {
      console.error('ID de producto inválido');
    }
  }
}
