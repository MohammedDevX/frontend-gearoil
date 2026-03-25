import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-component-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div *ngIf="title || desc" class="border-b border-gray-200 px-5 py-4 dark:border-white/[0.05] sm:px-6">
        <h3 *ngIf="title" class="text-lg font-semibold text-gray-800 dark:text-white/90">{{ title }}</h3>
        <p *ngIf="desc" class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ desc }}</p>
      </div>
      <div class="px-5 py-4 sm:p-6">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class ComponentCardComponent {
  @Input() title: string = '';
  @Input() desc: string = '';
}
