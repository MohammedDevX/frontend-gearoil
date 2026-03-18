import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
// Import your auth service if you have one!
// import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Option A: Get token directly from localStorage
  const token = localStorage.getItem('jwt_token');

  // Option B: Get token from an injected service
  // const authService = inject(AuthService);
  // const token = authService.getToken();

  if (token) {
    // Clone the request and attach the Authorization header
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // Send the cloned request with the token to the next handler
    return next(clonedRequest);
  }

  // If there is no token, just pass the original request
  return next(req);
};
