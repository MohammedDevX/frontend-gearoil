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

  /** Persist the JWT in localStorage. */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /** Retrieve the JWT from localStorage (null if absent). */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** Remove the JWT from localStorage. */
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Returns true when a token is present in localStorage.
   * Used by AuthGuard on every navigation and on page refresh.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** Clear the token (call this on logout). */
  logout(): void {
    this.removeToken();
  }

  // ── API calls ─────────────────────────────────────────────────────────────

  /** Email/password login – stores token on success. */
  login(credentials: LoginDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response?.accessToken) {
          this.setToken(response.accessToken);
        }
      }),
      catchError(this.handleError)
    );
  }

  /** Google OAuth login – stores token on success. */
  googleLogin(idToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/google`, { IdToken: idToken }).pipe(
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
    return this.http.post<any>(`${this.apiUrl}/login/facebook`, { AccessToken: accessToken }).pipe(
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
      .post<any>(`${this.apiUrl}/register`, userData)
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
   * Finalize password reset with email + token + new password.
   * Frontend calls /api/reset-password → proxy forwards to http://localhost:5000/reset-password.
   * API also returns plain text.
   */
  resetPassword(payload: ResetPasswordDTO): Observable<string> {
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
