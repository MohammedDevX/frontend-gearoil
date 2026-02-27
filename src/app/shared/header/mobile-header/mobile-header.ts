import { Component } from '@angular/core';

@Component({
  selector: 'app-mobile-header',
  imports: [],
  templateUrl: './mobile-header.html',
  styleUrl: './mobile-header.scss',
})
export class MobileHeader {
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
