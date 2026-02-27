import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-account-dropdown',
  imports: [],
  standalone: true,
  templateUrl: './account-dropdown.html',
  styleUrl: './account-dropdown.scss',
})
export class AccountDropdown {
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
