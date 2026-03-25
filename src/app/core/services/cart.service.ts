import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cart, CartItem, AddItemInput } from '../../models/cart.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = '/api/carts';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient, private tokenService: TokenService) {
    if (this.tokenService.isLoggedIn()) {
      this.refreshCart();
    }
  }

  /**
   * Fetches the current user's cart from the backend.
   */
  refreshCart(): void {
    this.http
      .get<Cart>(this.apiUrl)
      .pipe(
        tap((cart) => this.cartSubject.next(cart)),
        catchError(this.handleError)
      )
      .subscribe();
  }

  /**
   * Adds an item to the cart.
   */
  addItem(input: AddItemInput): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/items`, input).pipe(
      tap((cart) => this.cartSubject.next(cart)),
      catchError(this.handleError)
    );
  }

  /**
   * Removes an item from the cart by SKU.
   */
  removeItem(sku: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${sku}`).pipe(
      tap(() => this.refreshCart()), // Refresh the cart after removal
      catchError(this.handleError)
    );
  }

  /**
   * Clears the entire cart.
   */
  clearCart(): Observable<void> {
    return this.http.delete<void>(this.apiUrl).pipe(
      tap(() => this.cartSubject.next(null)),
      catchError(this.handleError)
    );
  }

  /**
   * Getter for the current cart value.
   */
  get currentCart(): Cart | null {
    return this.cartSubject.value;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'An error occurred while managing the cart.';
    if (error.error && typeof error.error === 'object') {
      message = error.error.message || error.error.detail || message;
    }
    return throwError(() => new Error(message));
  }
}
