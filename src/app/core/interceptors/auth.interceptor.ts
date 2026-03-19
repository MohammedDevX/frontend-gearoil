import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Auth Interceptor — automatically attaches the JWT token from localStorage or sessionStorage
 * to every outgoing HTTP request as an Authorization: Bearer header.
 * Also handles 401 Unauthorized responses by clearing the session and
 * redirecting the user to the login page.
 */
export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    const router = inject(Router);
    // Check both potential storage locations for the JWT
    const token = localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token');

    // Clone the request and add the Authorization header if a token is present
    const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(authReq).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                // Token is expired or invalid — clear session across all storages and redirect
                localStorage.removeItem('auth_token');
                sessionStorage.removeItem('auth_token');
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};
