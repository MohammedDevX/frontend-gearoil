import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="text-xs rounded-full px-2 py-0.5 font-medium"
      [ngClass]="{
        'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-500': color === 'success',
        'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-500': color === 'error',
        'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-500': color === 'warning',
        'bg-gray-50 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400': color === 'light'
      }"
    >
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  @Input() color: 'success' | 'warning' | 'error' | 'light' = 'light';
  @Input() size: 'sm' | 'md' | 'lg' = 'sm';
}
