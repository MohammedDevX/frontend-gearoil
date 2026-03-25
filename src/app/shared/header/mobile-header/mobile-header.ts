import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-mobile-header',
  imports: [RouterLink, RouterModule, AsyncPipe],
  standalone: true,
  templateUrl: './mobile-header.html',
  styleUrl: './mobile-header.scss',
})
export class MobileHeader {
  private cartService = inject(CartService);
  cart$ = this.cartService.cart$;

  isMenuOpen = false;
  isSearchOpen = false;
  isVehiclePickerOpen = false;
  activeVehiclePanel: 'list' | 'form' = 'list';

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  openSearch(): void {
    this.isSearchOpen = true;
  }

  closeSearch(): void {
    this.isSearchOpen = false;
  }

  openVehiclePicker(): void {
    this.isVehiclePickerOpen = true;
    this.activeVehiclePanel = 'list';
  }

  closeVehiclePicker(): void {
    this.isVehiclePickerOpen = false;
  }

  setVehiclePanel(panel: 'list' | 'form'): void {
    this.activeVehiclePanel = panel;
  }
}
