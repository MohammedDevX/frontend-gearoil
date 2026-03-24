import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-dropdown',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-dropdown.html',
  styleUrl: './cart-dropdown.scss',
})
export class CartDropdown {
  private cartService = inject(CartService);
  cart$ = this.cartService.cart$;
  isOpen = false;

  constructor(private elementRef: ElementRef) { }

  removeItem(sku: string) {
    this.cartService.removeItem(sku).subscribe();
  }

  toggle(event: Event) {
    event.preventDefault();
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
