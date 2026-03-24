import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = '/api';
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) { }

  // ── Token helpers ──────────────────────────────────────────────────────────

  /**
   * Persist the JWT.
   * rememberMe=true  → localStorage  (survives browser close)
   * rememberMe=false → sessionStorage (cleared on tab/browser close)
   */
  setToken(token: string, rememberMe = false): void {
    if (rememberMe) {
      localStorage.setItem(this.TOKEN_KEY, token);
      sessionStorage.removeItem(this.TOKEN_KEY);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  /** Retrieve the JWT — checks both storages. */
  getToken(): string | null {
    // return localStorage.getItem(this.TOKEN_KEY) ?? sessionStorage.getItem(this.TOKEN_KEY);
    // FORCE HARDCODED TOKEN FOR TESTING
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMWVlMTczNy03NDQ3LTRmYTQtYWZiYS0xZWYwODhmNGZjMDEiLCJlbWFpbCI6ImF5b3ViYXphbXJpMEBnbWFpbC5jb20iLCJSb2xlIjoiQWRtaW4iLCJleHAiOjE3NzQzNjc4MjYsImlzcyI6IlVzZXJTZXJ2aWNlIiwiYXVkIjoiVXNlclNlcnZpY2VDbGllbnQifQ.E_Am--I8F0gdAQPzVtVU-7-BCOkz0vbpTafc-svtcu';
  }

  /** Remove the JWT from both storages. */
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  /** Returns true when a token is present. Used by AuthGuard. */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** Clear the token on logout. */
  logout(): void {
    this.removeToken();
  }

  // ── API calls ─────────────────────────────────────────────────────────────

  /** Email/password login – stores token on success. */
  login(credentials: LoginDTO & { rememberMe?: boolean }): Observable<any> {
    const rememberMe = credentials.rememberMe ?? false;
    const { rememberMe: _, ...body } = credentials; // Don't send rememberMe to the backend
    return this.http.post<any>(`${this.apiUrl}/auth/login`, body).pipe(
      tap((response: any) => {
        if (response?.accessToken) {
          this.setToken(response.accessToken, rememberMe);
        }
      }),
      catchError(this.handleError)
    );
  }

  /** Google OAuth login – stores token on success. */
  googleLogin(idToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/google-login`, { IdToken: idToken }).pipe(
      tap((response: any) => {
        if (response?.accessToken) {
          this.setToken(response.accessToken);
        }
      }),
      catchError(this.handleError)
    );
  }

  /** Facebook OAuth login – stores token on success. */
  facebookLogin(accessToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login/facebook`, { AccessToken: accessToken }).pipe(
      tap((response: any) => {
        if (response?.accessToken) {
          this.setToken(response.accessToken);
        }
      }),
      catchError(this.handleError)
    );
  }

  /** User registration. */
  register(userData: RegisterDTO): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth`, userData)  // Ocelot: POST /auth → /api/auth/register-client
      .pipe(catchError(this.handleError));
  }

  /** Send a password-reset email. */
  sendResetPasswordEmail(email: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/forgot-password`, { Email: email })
      .pipe(catchError(this.handleError));
  }

  /**
   * Request a password reset link.
   * Frontend calls /api/forgot-password → proxy forwards to http://localhost:5000/forgot-password.
   * The API returns plain text (not JSON), so we use responseType: 'text'.
   */
  forgotPassword(email: string): Observable<string> {
    return this.http
      .post(`${this.apiUrl}/forgot-password`, { email }, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  /**
   * Verify if the reset token is still valid.
   */
  verifyResetToken(email: string, token: string): Observable<boolean> {
    return this.http
      .post<boolean>(`${this.apiUrl}/auth/verify-reset-token`, { email, token })
      .pipe(catchError(this.handleError));
  }

  /**
   * Finalize password reset with email + token + new password.
   * Frontend calls /api/auth/reset-password.
   */
  resetPassword(payload: ResetPasswordDTO): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/reset-password`, payload, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  // ── Error handler ─────────────────────────────────────────────────────────

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
