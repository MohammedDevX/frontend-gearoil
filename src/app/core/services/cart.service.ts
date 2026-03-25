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
  private defaultCart: Cart = { id: '', clientId: '', totalPrice: 0, items: [] };
  private cartSubject = new BehaviorSubject<Cart>(this.defaultCart);
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
        tap((cart) => this.cartSubject.next(cart || this.defaultCart)),
        catchError((error) => {
          this.cartSubject.next(this.defaultCart);
          return this.handleError(error);
        })
      )
      .subscribe({ error: () => { } });
  }

  /**
   * Adds an item to the cart.
   * Applies optimistic update immediately, then refreshes from server.
   */
  addItem(input: AddItemInput): Observable<any> {
    // Optimistic update: add item instantly to local state
    const previousCart = this.cartSubject.value;
    const existingItem = previousCart.items.find(i => i.sku === input.sku);
    let optimisticItems;
    if (existingItem) {
      // Increase quantity
      optimisticItems = previousCart.items.map(i =>
        i.sku === input.sku ? { ...i, quantity: i.quantity + input.quantity } : i
      );
    } else {
      // Add new item with placeholder price
      optimisticItems = [...previousCart.items, { sku: input.sku, quantity: input.quantity, price: 0, total: 0, productReserve: 0 }];
    }
    this.cartSubject.next({ ...previousCart, items: optimisticItems });

    return this.http.post<any>(`${this.apiUrl}/items`, input).pipe(
      tap((res: any) => {
        // If Symfony returns the full cart, use it directly
        if (res && res.items !== undefined) {
          this.cartSubject.next(res as Cart);
        } else {
          // Backend returned something unexpected — fallback to GET
          this.refreshCart();
        }
      }),
      catchError((error) => {
        this.cartSubject.next(previousCart); // Rollback on error
        return this.handleError(error);
      })
    );
  }

  /**
   * Removes an item from the cart by SKU.
   * Uses optimistic update for instant UI. On success, uses the cart from the
   * backend response (HTTP 200) to sync the exact state. On error, rolls back.
   */
  removeItem(sku: string): Observable<Cart> {
    const previousCart = this.cartSubject.value;

    // Optimistic update: remove item from local state immediately
    const updatedItems = previousCart.items.filter(item => item.sku !== sku);
    const updatedTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    this.cartSubject.next({ ...previousCart, items: updatedItems, totalPrice: updatedTotal });

    return this.http.delete<Cart>(`${this.apiUrl}/items/${sku}`).pipe(
      // Use the cart returned by the backend (status 200) directly
      tap((cart: Cart) => {
        if (cart && cart.items) {
          this.cartSubject.next(cart);
        }
      }),
      catchError((error) => {
        // On failure: restore the previous cart state
        this.cartSubject.next(previousCart);
        return this.handleError(error);
      })
    );
  }

  /**
   * Clears the entire cart.
   */
  clearCart(): Observable<void> {
    return this.http.delete<void>(this.apiUrl).pipe(
      tap(() => this.cartSubject.next(this.defaultCart)),
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
    console.error('--- API ERROR DETAILED ---', error);
    let message = 'An error occurred while managing the cart.';
    if (error.error && typeof error.error === 'object') {
      message = error.error.message || error.error.detail || message;
    }
    return throwError(() => new Error(message));
  }
}
