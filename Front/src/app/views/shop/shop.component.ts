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
import { shuffleArray, paginateArray } from '../../helpers/productHelper';

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
  currentPage = 1;
  pageSize = 12;
  paginatedProducts: Product[] = [];

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
    this.availableProducts = shuffleArray(products);
    this.filteredProducts = [...this.availableProducts];
    this.paginate();
  });
  }

  paginate(): void {
  this.paginatedProducts = paginateArray(this.filteredProducts, this.currentPage, this.pageSize);
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
    : [...this.availableProducts];

  this.currentPage = 1;
  this.paginate();
}

filterBySubcategory(subId: string): void {
  this.selectedSubcategoryId = subId;
  this.expandParentOfSubcategory(subId);

  this.filteredProducts = this.availableProducts.filter((p) =>
    p.subcategories?.includes(subId)
  );

  this.currentPage = 1;
  this.paginate();
}

goToPage(page: number): void {
  this.currentPage = page;
  this.paginate();
}
get totalPages(): number {
  return Math.ceil(this.filteredProducts.length / this.pageSize);
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
  const isCurrentlyExpanded = this.expandedCategories[catId];

  // Reiniciar todos a false
  this.expandedCategories = {};

  // Si no estaba expandida, expandirla
  if (!isCurrentlyExpanded) {
    this.expandedCategories[catId] = true;
  }
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
