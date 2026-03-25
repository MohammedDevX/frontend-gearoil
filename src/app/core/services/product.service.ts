import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../models/product';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private supplierUrl = `${environment.apiUrl}/suppliers`;

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

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(this.resolveUrl(id));
  }

  createProduct(product: any): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product, {
      headers: { 'Content-Type': 'application/ld+json' }
    });
  }

  updateProduct(id: string, product: any): Observable<Product> {
    return this.http.put<Product>(this.resolveUrl(id), product, {
      headers: { 'Content-Type': 'application/ld+json' }
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

  // Helper methods for category/supplier
  getCategories(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/categories`).pipe(
      map((res: any) => res['hydra:member'] || res['member'] || res)
    );
  }

  getSuppliers(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/suppliers`).pipe(
      map((res: any) => res['hydra:member'] || res['member'] || res)
    );
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../../models/IProduct';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = "http://localhost:5000/products";

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.url);
  }

  getActiveProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.url}/active`);
  }

  getProductById(id: string): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.url}/${id}`);
  }
}
