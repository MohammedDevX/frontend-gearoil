import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

/**
 * Loading Interceptor — shows the global spinner before every HTTP request
 * and hides it when the request completes (success or error).
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);

  // Skip global loader for cart-related requests to prevent UI blocking if the service is down
  if (req.url.includes('/api/carts')) {
    return next(req);
  }

  loading.show();
  return next(req).pipe(finalize(() => loading.hide()));
};
