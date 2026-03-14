import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * AuthGuard – protects routes that require authentication.
 * Returns a UrlTree redirect to /login when the token is absent,
 * which is the Angular-recommended pattern (avoids navigation race conditions).
 */
export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    }

    // Return a UrlTree — Angular handles the redirect cleanly
    return router.createUrlTree(['/login']);
};
