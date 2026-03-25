import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../core/services/token.service';

/**
 * AuthGuard – protects routes that require authentication.
 * Returns a UrlTree redirect to /login when no access token is present,
 * which is the Angular-recommended pattern (avoids navigation race conditions).
 */
export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
