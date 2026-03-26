export const PUBLIC_PATHS = [
  '/',
  '/home',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/shop',
  '/products',
  '/detail'
];

/**
 * These endpoints should NEVER trigger an Auth redirect or carry a Bearer token.
 */
export const AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/refresh-token',
  '/auth/register',
  '/auth/google-login',
  '/auth/login/facebook'
];
