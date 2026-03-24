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

  getAllProducts(page: number = 1, pageSize: number = 100): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&itemsPerPage=${pageSize}`).pipe(
      map((res: any) => ({
        ...res,
        items: res['hydra:member'] || res['member'] || res
      }))
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: any): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string, product: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
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
