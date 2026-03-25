import { Injectable } from '@angular/core';

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const REMEMBER_ME_KEY = 'remember_me';

/**
 * TokenService — single-responsibility service for all JWT token CRUD.
 *
 * Encapsulates localStorage / sessionStorage logic:
 *   • rememberMe = true  → localStorage  (survives browser close)
 *   • rememberMe = false → sessionStorage (cleared on tab / browser close)
 */
@Injectable({ providedIn: 'root' })
export class TokenService {

  // ── Write ─────────────────────────────────────────────────────────────────

  /**
   * Persist both the access and refresh tokens.
   * The `rememberMe` flag is itself stored so future writes (after a silent
   * refresh) use the same storage.
   */
  setTokens(accessToken: string, refreshToken: string, rememberMe = false): void {
    this.clear(); // wipe the other storage to avoid stale values

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(ACCESS_TOKEN_KEY, accessToken);
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    storage.setItem(REMEMBER_ME_KEY, String(rememberMe));
  }

  // ── Read ──────────────────────────────────────────────────────────────────

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
      ?? sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
      ?? sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /** Returns true when an access token is present. */
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  /** Remove every auth-related key from both storages. */
  clear(): void {
    for (const key of [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, REMEMBER_ME_KEY]) {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Which storage did the user originally choose? */
  get rememberMe(): boolean {
    return (localStorage.getItem(REMEMBER_ME_KEY) ?? sessionStorage.getItem(REMEMBER_ME_KEY)) === 'true';
  }
}
