import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Auth Interceptor — automatically attaches the JWT token from localStorage
 * to every outgoing HTTP request as an Authorization: Bearer header.
 * Also handles 401 Unauthorized responses by clearing the session and
 * redirecting the user to the login page.
 */
export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    const router = inject(Router);
    const token = localStorage.getItem('auth_token');

    // Clone the request and add the Authorization header if a token is present
    const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(authReq).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                // Token is expired or invalid — clear session and redirect to login
                localStorage.removeItem('auth_token');
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
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
