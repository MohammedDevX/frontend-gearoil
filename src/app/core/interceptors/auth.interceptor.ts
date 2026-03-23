import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

/**
 * Auth Interceptor — automatically attaches the JWT token from storage (or hardcoded for test)
 * to every outgoing HTTP request as an Authorization: Bearer header.
 */
export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    
    // Get the token from the centralized AuthService
    const token = authService.getToken();

        // const token = localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token') ?? testToken;

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
