import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { TokenService } from '../services/token.service';

// ─── Shared state for coordinating concurrent refresh ────────────────────────

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

/** Paths that should never trigger a 401 redirect. */
const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/reset-password'];

/** Paths whose requests must never carry a Bearer token or trigger refresh. */
const AUTH_ENDPOINTS = ['/auth/login', '/auth/refresh-token', '/auth/register', '/auth/google-login', '/auth/login/facebook'];

// ─── Interceptor ─────────────────────────────────────────────────────────────

/**
 * Auth Interceptor
 *
 * 1. Attaches the access token as a Bearer header to every outgoing request
 *    (except auth endpoints themselves).
 * 2. On a 401 response:
 *    a. If a refresh is already in-flight → queues the request until the new
 *       token arrives, then retries.
 *    b. Otherwise → calls AuthService.refreshTokens(), stores the new pair,
 *       and retries the original request.
 *    c. If the refresh itself fails → clears tokens and redirects to /login
 *       (unless the user is already on a public page).
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  // Don't attach tokens to auth endpoints (login, refresh, register, etc.)
  if (AUTH_ENDPOINTS.some((ep) => req.url.includes(ep))) {
    return next(req);
  }

  // Attach the current access token
  const token = tokenService.getAccessToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401(req, next, router, authService, tokenService);
      }
      return throwError(() => error);
    }),
  );
};

// ─── 401 handler with silent refresh ─────────────────────────────────────────

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  router: Router,
  authService: AuthService,
  tokenService: TokenService,
): Observable<any> {

  // If we are already refreshing, queue the failed request
  if (isRefreshing) {
    return refreshSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((newToken) => next(addToken(req, newToken!))),
    );
  }

  // No refresh in-flight → initiate one
  isRefreshing = true;
  refreshSubject.next(null);

  return authService.refreshTokens().pipe(
    switchMap((tokens) => {
      isRefreshing = false;
      refreshSubject.next(tokens.accessToken);
      return next(addToken(req, tokens.accessToken));
    }),
    catchError((refreshError) => {
      isRefreshing = false;
      refreshSubject.next(null);
      tokenService.clear();

      // Only redirect if the user is NOT on a public page
      if (!PUBLIC_PATHS.some((p) => router.url.startsWith(p))) {
        router.navigate(['/login']);
      }

      return throwError(() => refreshError);
    }),
  );
}

/** Clone a request and attach a new Bearer token. */
function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}
