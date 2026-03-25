import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent {
  private cartService = inject(CartService);
  cart$ = this.cartService.cart$;

  removeItem(sku: string) {
    this.cartService.removeItem(sku).subscribe();
  }

  clearCart() {
    this.cartService.clearCart().subscribe();
  }
}
