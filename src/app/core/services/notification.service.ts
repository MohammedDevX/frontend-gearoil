import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

/**
 * Centralised notification service.
 * Use this instead of injecting ToastrService directly in components
 * so that message formatting and error extraction stay in one place.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  success(message: string, title = 'Success'): void {
    this.toastr.success(message, title);
  }

  error(err: any, title = 'Error'): void {
    const message = err?.error?.message ?? err?.message ?? 'Something went wrong.';
    this.toastr.error(message, title);
  }

  info(message: string, title = 'Info'): void {
    this.toastr.info(message, title);
  }

  warning(message: string, title = 'Warning'): void {
    this.toastr.warning(message, title);
  }
}
