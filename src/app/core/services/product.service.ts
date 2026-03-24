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

  constructor(private http: HttpClient) {}

  getProducts(page: number, pageSize: number): Observable<{ items: Product[], totalCount: number }> {
    return this.http.get<{ items: Product[], totalCount: number }>(`${this.apiUrl}?pageNumber=${page}&pageSize=${pageSize}`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Helper methods for category/supplier
  getCategories(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/categories`).pipe(
      map((res: any) => res['hydra:member'] || res)
    );
  }

  getSuppliers(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/suppliers`).pipe(
      map((res: any) => res['hydra:member'] || res)
    );
  }
}
