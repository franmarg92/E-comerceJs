import { Component, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CategoryService } from '../../services/category/category.service';
import { ProductService } from '../../services/product/product.service';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PLATFORM_ID } from '@angular/core';
import { Category } from '../../models/categoryModel';
import { Product } from '../../models/productModel';
import { CartItem } from '../../models/cartModel';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent {
  availableCategories: Category[] = [];
  subcategoriesMap: { [parentId: string]: Category[] } = {};
  selectedCategoryId: string | null = null;
  selectedSubcategoryId: string | null = null;
  expandedCategories: { [catId: string]: boolean } = {};

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

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.loadUser();
    this.listenAuthStatus();
  }

  private loadCategories(): void {
    this.categoryService.getAllCategory().subscribe((res: any) => {
      const all = Array.isArray(res.categories) ? res.categories : [];

      this.availableCategories = all.filter((cat: Category) => !cat.parent);

      for (const parent of this.availableCategories.filter((c) => c._id)) {
        this.categoryService
          .getSubcategories(parent._id!)
          .subscribe((res: any) => {
            this.subcategoriesMap[parent._id!] = res.subcategories || [];
          });
      }
    });
  }

  private loadProducts(): void {
    this.productService.getAllProducts().subscribe((res: any) => {
      const products = Array.isArray(res) ? res : [];
      this.availableProducts = products;
      this.filteredProducts = products;
    });
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

  filterByCategory(catId: string | null): void {
    this.selectedCategoryId = catId;
    this.selectedSubcategoryId = null;

    this.filteredProducts = catId
      ? this.availableProducts.filter((p) => p.categories?.includes(catId))
      : this.availableProducts;
  }

  filterBySubcategory(subId: string): void {
    this.selectedSubcategoryId = subId;

    // Expand categoría padre automáticamente si está colapsada
    this.expandParentOfSubcategory(subId);

    this.filteredProducts = this.availableProducts.filter((p) =>
      p.subcategories?.includes(subId)
    );
  }

  onCategoryClick(catId: string): void {
  this.toggleCategory(catId);         
  this.filterByCategory(catId);        
}

  expandParentOfSubcategory(subId: string): void {
    for (const parentId in this.subcategoriesMap) {
      const found = this.subcategoriesMap[parentId].some(
        (sub) => sub._id === subId
      );
      if (found) {
        this.expandedCategories[parentId] = true;
        this.selectedCategoryId = parentId;
        break;
      }
    }
  }

  toggleCategory(catId: string): void {
    this.expandedCategories[catId] = !this.expandedCategories[catId];
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
