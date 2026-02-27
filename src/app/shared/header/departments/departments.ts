import { Component, HostListener, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'app-departments',
  imports: [],
  standalone: true,
  templateUrl: './departments.html',
  styleUrl: './departments.scss',
})
export class Departments {
  private eRef = inject(ElementRef); // ✅ use inject() instead of constructor

  isDepartmentsOpen = false;
  hoveredItemIndex: number | null = null;

  toggleDepartments(event: Event): void {
    event.stopPropagation();
    this.isDepartmentsOpen = !this.isDepartmentsOpen;
  }

  onItemMouseEnter(index: number): void {
    this.hoveredItemIndex = index;
  }

  onItemMouseLeave(): void {
    this.hoveredItemIndex = null;
  }

  isItemHovered(index: number): boolean {
    return this.hoveredItemIndex === index;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isDepartmentsOpen = false;
    }
  }
}