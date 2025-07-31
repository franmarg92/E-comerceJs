import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Product } from '../../models/productModel';
import { ProductService } from '../../services/product/product.service';
import { CardsComponent } from '../../shared/cards/cards.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  featuredProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadFeaturedProducts();
  }

  private loadFeaturedProducts(): void {
   this.productService
  .getFeaturedProducts()
  .subscribe((res: Product[]) => {
    this.featuredProducts = res;
  });
console.log(this.featuredProducts)
  }
}
