import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <input
        [type]="type"
        [id]="id"
        [name]="name"
        [placeholder]="placeholder"
        [value]="value"
        [min]="min"
        [max]="max"
        [step]="step"
        [disabled]="disabled"
        [ngClass]="inputClasses"
        (input)="onInput($event)"
      />

      @if (hint) {
      <p class="mt-1.5 text-xs"
        [ngClass]="{
          'text-error-500': error,
          'text-success-500': success,
          'text-gray-500': !error && !success
        }">
        {{ hint }}
      </p>
      }
    </div>
  `,
  styles: [`
    input[type="file"] {
      padding-left: 0.75rem;
      padding-top: 0.4rem;
    }
    input[type="file"]::file-selector-button {
      background-color: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      padding: 0.4rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 500;
      margin-right: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    input[type="file"]::file-selector-button:hover {
      background-color: #e5e7eb;
    }
    :host-context(.dark) input[type="file"]::file-selector-button {
      background-color: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.9);
      border-color: rgba(255, 255, 255, 0.1);
    }
    :host-context(.dark) input[type="file"]::file-selector-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class InputFieldComponent {

  @Input() type: string = 'text';
  @Input() id?: string = '';
  @Input() name?: string = '';
  @Input() placeholder?: string = '';
  @Input() value: string | number = '';
  @Input() min?: string;
  @Input() max?: string;
  @Input() step?: number;
  @Input() disabled: boolean = false;
  @Input() success: boolean = false;
  @Input() error: boolean = false;
  @Input() hint?: string;
  @Input() className: string = '';

  @Output() valueChange = new EventEmitter<string | number>();
  @Output() fileChange = new EventEmitter<FileList | null>();

  get inputClasses(): string {
    let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${this.className}`;

    if (this.disabled) {
      inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-40`;
    } else if (this.error) {
      inputClasses += ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
    } else if (this.success) {
      inputClasses += ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
    } else {
      inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800`;
    }
    return inputClasses;
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.type === 'file') {
      this.fileChange.emit(input.files);
    } else {
      this.valueChange.emit(this.type === 'number' ? +input.value : input.value);
    }
  }
}
