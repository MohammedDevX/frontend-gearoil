import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Product } from '../../models/product';
import { IProduct } from '../../models/IProduct';
import { ProductHome } from '../models/product-home.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private homeProductsCache$: Observable<ProductHome[]> | null = null;

  constructor(private http: HttpClient) {}

  private resolveUrl(id: string, defaultBase: string = this.apiUrl): string {
    if (!id) return defaultBase;
    // If it's already a full URL or an IRI (starts with /api), use it directly
    if (id.toString().startsWith('http') || id.toString().startsWith('/')) {
      return id;
    }
    return `${defaultBase}/${id}`;
  }

  getAllProducts(page: number = 1, pageSize: number = 100): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&itemsPerPage=${pageSize}`).pipe(
      map((res: any) => ({
        ...res,
        items: res['hydra:member'] || res['member'] || res
      }))
    );
  }

  getActiveProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.apiUrl}/active`);
  }

  getHomeProducts(): Observable<ProductHome[]> {
    if (!this.homeProductsCache$) {
      this.homeProductsCache$ = this.http.get<any>(`${environment.apiUrl}/products/active`).pipe(
        map(response => {
          const items = response.member || response['hydra:member'] || [];
          return items.map((item: any) => {
            // Extract ID from @id if necessary (e.g., '/api/products/123' -> '123')
            let id = item.id;
            if (!id && item['@id']) {
              const parts = item['@id'].split('/');
              id = parts[parts.length - 1];
            }
            
            return {
              id: id || '',
              sku: item.sku || '',
              name: item.name || '',
              urlImage: item.urlImage || null,
              price: item.price || 0,
              averageRating: item.averageRating || 0,
              reviewsCount: item.reviewsCount || 0
            } as ProductHome;
          });
        }),
        shareReplay(1) // Cache the latest response for future valid subscribers
      );
    }
    return this.homeProductsCache$;
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(this.resolveUrl(id));
  }

  createProduct(product: any): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product, {
      headers: { 'Content-Type': 'application/ld+json' }
    });
  }

  updateProduct(id: string, product: any): Observable<Product> {
    return this.http.patch<Product>(this.resolveUrl(id), product, {
      headers: { 'Content-Type': 'application/merge-patch+json' }
    });
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(this.resolveUrl(id));
  }

  uploadImage(file: File): Observable<{ path: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ path: string }>(`${environment.apiUrl}/upload`, formData);
  }

  // Helper methods for category
  getCategories(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/categories`).pipe(
      map((res: any) => res['hydra:member'] || res['member'] || res)
    );
  }
}
