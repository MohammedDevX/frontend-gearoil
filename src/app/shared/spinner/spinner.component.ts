import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  template: `
    @if (loading.isLoading$ | async) {
      <div class="spinner-overlay" aria-label="Loading…" role="status">
        <div class="spinner-ring">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
    }
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(2px);
    }

    /* Classic CSS ring spinner */
    .spinner-ring {
      display: inline-block;
      position: relative;
      width: 64px;
      height: 64px;
    }

    .spinner-ring div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 48px;
      height: 48px;
      margin: 8px;
      border: 5px solid transparent;
      border-top-color: #f97316; /* accent colour — adjust to match your brand */
      border-radius: 50%;
      animation: spinner-ring 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }

    .spinner-ring div:nth-child(1) { animation-delay: -0.45s; }
    .spinner-ring div:nth-child(2) { animation-delay: -0.3s; }
    .spinner-ring div:nth-child(3) { animation-delay: -0.15s; }

    @keyframes spinner-ring {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class SpinnerComponent {
  constructor(public loading: LoadingService) {}
}
