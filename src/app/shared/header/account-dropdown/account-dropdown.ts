import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-account-dropdown',
  imports: [RouterLink, RouterModule, CommonModule],
  standalone: true,
  templateUrl: './account-dropdown.html',
  styleUrl: './account-dropdown.scss',
})
export class AccountDropdown {
  isOpen = false;

  constructor(private elementRef: ElementRef, public tokenService: TokenService) { }

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
