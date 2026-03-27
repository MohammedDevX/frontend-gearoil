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

  /** Returns true when an access token is present (and optionally not expired). */
  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  /** Decodes the JWT and checks if it is expired (or about to expire within 60s). */
  isTokenExpired(token: string | null): boolean {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload || !payload.exp) {
        return false; // If no exp claim, assume it doesn't expire
      }
      const expTimeInSeconds = payload.exp;
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      return expTimeInSeconds < currentTimeInSeconds + 60; // 60 seconds buffer
    } catch (e) {
      return true; // Parse error -> treat as expired
    }
  }

  /** Extracts the Role claim from the JWT token. Checks multiple common claim names. */
  getUserRole(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Common role claim keys
      const roleKeys = [
        'Role',
        'role',
        'roles',
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];

      for (const key of roleKeys) {
        if (payload[key]) {
          return payload[key];
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /** Extracts the Email claim from the JWT token. Checks multiple common claim names. */
  getUserEmail(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Common email claim keys
      const emailKeys = [
        'email',
        'Email',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      ];

      for (const key of emailKeys) {
        if (payload[key]) {
          return payload[key];
        }
      }
      return null;
    } catch (e) {
      return null;
    }
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
