import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-cart-dropdown',
  imports: [],
  standalone: true,
  templateUrl: './cart-dropdown.html',
  styleUrl: './cart-dropdown.scss',
})
export class CartDropdown {
  isOpen = false;

  constructor(private elementRef: ElementRef) { }

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
