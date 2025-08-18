import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Product } from '../../models/productModel';
import { ProductService } from '../../services/product/product.service';
import { CardsComponent } from '../../shared/cards/cards.component';

@Component({
  selector: 'app-home',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, CardsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  featuredProducts: Product[] = [];
  portfolioProducts: Product[] = [];
  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadFeaturedProducts();
    this.loadPortfolioProducts();
  }

  private loadPortfolioProducts(): void {
    this.productService.getPortfolioProducts().subscribe((res: Product[]) => {
      this.portfolioProducts = res;
    });
  }

  private loadFeaturedProducts(): void {
    this.productService.getFeaturedProducts().subscribe((res: Product[]) => {
      this.featuredProducts = res;
    });
  }

isPortfolioAndFeatured(): Product[] {
  if (!this.portfolioProducts || !this.featuredProducts) return [];
  return this.featuredProducts.filter(product =>
    this.portfolioProducts.some(p => p._id === product._id)
  );
}

isFeaturedNotPortfolio(): Product[] {
  if (!this.featuredProducts || !this.portfolioProducts) return [];
  return this.featuredProducts.filter(product =>
    !this.portfolioProducts.some(p => p._id === product._id)
  );
}
}
