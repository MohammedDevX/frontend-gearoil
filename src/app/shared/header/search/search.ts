import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-search',
  imports: [],
  standalone: true,
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  isSuggestionsOpen = false;
  isVehiclePickerOpen = false;

  constructor(private elementRef: ElementRef) { }

  openSuggestions() {
    this.isSuggestionsOpen = true;
    this.isVehiclePickerOpen = false;
  }

  toggleVehiclePicker(event: Event) {
    event.preventDefault();
    this.isVehiclePickerOpen = !this.isVehiclePickerOpen;
    this.isSuggestionsOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isSuggestionsOpen = false;
      this.isVehiclePickerOpen = false;
    }
  }
}
