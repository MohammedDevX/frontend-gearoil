import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductHome } from '../../core/models/product-home.model';
import { CartService } from '../../core/services/cart.service';
import { TokenService } from '../../core/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss'],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductHome;
  isAddingToCart = false;

  constructor(
    private cartService: CartService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  get stars(): boolean[] {
    const rating = Math.round(this.product.averageRating);
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  addToCart(): void {
    if (!this.tokenService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.isAddingToCart = true;
    this.cartService.addItem({ sku: this.product.sku, quantity: 1 }).subscribe({
      next: () => { this.isAddingToCart = false; },
      error: () => { this.isAddingToCart = false; }
    });
  }
}
