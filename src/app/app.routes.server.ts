import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Auth-related routes are client-side only (they use localStorage / social auth SDKs)
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'register', renderMode: RenderMode.Client },
  { path: 'forgot-password', renderMode: RenderMode.Client },
  { path: 'reset-password', renderMode: RenderMode.Client },

  // Protected routes must be client-side only (AuthGuard uses localStorage)
  { path: 'home', renderMode: RenderMode.Client },

  // Wildcard fallback – can be prerendered (will simply redirect)
  { path: '**', renderMode: RenderMode.Prerender },
];
