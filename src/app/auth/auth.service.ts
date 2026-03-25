import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TokenService } from '../core/services/token.service';

// ─── DTOs ────────────────────────────────────────────────────────────────────

export interface RegisterDTO {
  FirstName: string;
  LastName: string;
  UserName: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
}

export interface LoginDTO {
  Email: string;
  Password: string;
}

export interface ResetPasswordDTO {
  email: string;
  token: string;
  newPassword: string;
}

/** Shape returned by the backend on login / refresh. */
export interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
  requiresTwoFactor?: boolean;
  userId?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {}

  // ── Token delegation ──────────────────────────────────────────────────────

  /** Convenience proxy — so callers don't need to import TokenService. */
  getToken(): string | null {
    return this.tokenService.getAccessToken();
  }

  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  logout(): void {
    this.tokenService.clear();
  }

  // ── API calls ─────────────────────────────────────────────────────────────

  /** Email / password login — stores both tokens on success. */
  login(credentials: LoginDTO & { rememberMe?: boolean }): Observable<AuthTokens> {
    const rememberMe = credentials.rememberMe ?? false;
    const { rememberMe: _, ...body } = credentials;
    return this.http.post<AuthTokens>(`${this.apiUrl}/auth/login`, body).pipe(
      tap((res) => this.storeTokens(res, rememberMe)),
      catchError(this.handleError),
    );
  }

  /** Google OAuth login — stores both tokens on success. */
  googleLogin(idToken: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.apiUrl}/auth/google-login`, { IdToken: idToken }).pipe(
      tap((res) => this.storeTokens(res)),
      catchError(this.handleError),
    );
  }

  /** Facebook OAuth login — stores both tokens on success. */
  facebookLogin(accessToken: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.apiUrl}/auth/login/facebook`, { AccessToken: accessToken }).pipe(
      tap((res) => this.storeTokens(res)),
      catchError(this.handleError),
    );
  }

  /**
   * Finalize login with a 2FA code.
   * If successful, it stores the returned tokens.
   */
  verify2fa(userId: string, code: string, rememberMe?: boolean): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.apiUrl}/auth/verify-2fa`, { UserId: userId, Code: code }).pipe(
      tap((res) => this.storeTokens(res, rememberMe)),
      catchError(this.handleError),
    );
  }

  /**
   * Silent token refresh.
   * Sends the refresh token to the backend and persists the new pair on success.
   */
  refreshTokens(): Observable<AuthTokens> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post<AuthTokens>(`${this.apiUrl}/auth/refresh-token`, { refreshToken }).pipe(
      tap((res) => this.storeTokens(res)),
      catchError(this.handleError),
    );
  }

  /** User registration. */
  register(userData: RegisterDTO): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth`, userData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Request a password reset link.
   * The API returns plain text (not JSON), so we use responseType: 'text'.
   */
  forgotPassword(email: string): Observable<string> {
    return this.http
      .post(`${this.apiUrl}/auth/forgot-password`, { email }, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  /** Finalize password reset with email + token + new password. */
  resetPassword(payload: ResetPasswordDTO): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/auth/reset-password`, payload, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  /** Persist tokens if the response contains them. */
  private storeTokens(res: AuthTokens, rememberMe?: boolean): void {
    if (res?.accessToken && res?.refreshToken) {
      this.tokenService.setTokens(
        res.accessToken,
        res.refreshToken,
        rememberMe ?? this.tokenService.rememberMe,
      );
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'An unexpected error occurred.';
    if (error.error) {
      if (typeof error.error === 'string') {
        message = error.error;
      } else if (typeof error.error === 'object') {
        const e = error.error as Record<string, unknown>;
        message =
          (e['message'] as string) ??
          (e['Message'] as string) ??
          (e['title'] as string) ??
          (e['detail'] as string) ??
          (Array.isArray(e['errors']) ? (e['errors'] as string[]).join(' ') : null) ??
          message;
      }
    }
    if (message === 'An unexpected error occurred.' && (error.status || error.statusText)) {
      message = `${error.status ?? ''} ${error.statusText ?? ''}`.trim() || message;
    }
    return throwError(() => new Error(message));
  }
}
