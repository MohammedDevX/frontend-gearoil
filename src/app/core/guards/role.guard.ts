import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

/**
 * RoleGuard – protects routes based on the expected roles defined in route data.
 * Redirects Admins trying to access Client pages back to /admin,
 * and Clients trying to access Admin pages back to /home.
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Get the role from the token
  const userRole = tokenService.getUserRole();

  // If there's no role, the user might not be logged in or token is invalid.
  // The authGuard usually handles this, but just to be safe:
  if (!userRole) {
    return router.createUrlTree(['/login']);
  }

  // Check expected roles from route data
  const expectedRoles = route.data?.['expectedRoles'] as Array<string>;

  // If the route doesn't specify roles, it means it's accessible to any authenticated user.
  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

  if (expectedRoles.includes(userRole)) {
    return true; // User has the required role
  }

  // User does NOT have the required role, handle redirection based on their actual role
  if (userRole === 'Admin') {
    return router.createUrlTree(['/admin']); // Send admins back to their dashboard instead of client pages
  } else {
    // Clients (or anyone else) get sent to home instead of admin pages
    return router.createUrlTree(['/home']);
  }
};
