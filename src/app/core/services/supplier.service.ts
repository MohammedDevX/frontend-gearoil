import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Supplier } from '../../models/supplier.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private readonly apiUrl = `${environment.apiUrl}/suppliers`;

  constructor(private http: HttpClient) {}

  private resolveUrl(id: string | number, defaultBase: string = this.apiUrl): string {
    if (!id) return defaultBase;
    const idStr = id.toString();
    // If it's already a full URL or an IRI (starts with /api), use it directly
    if (idStr.startsWith('http') || idStr.startsWith('/')) {
      return idStr;
    }
    return `${defaultBase}/${id}`;
  }

  /**
   * Fetches the list of suppliers with optional pagination and filtering.
   * Following clean architecture principles and best practices.
   */
  getSuppliers(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res: any) => res['hydra:member'] || res['member'] || res)
    );
  }

  /**
   * Fetches a single supplier by ID.
   */
  getSupplierById(id: string | number): Observable<Supplier> {
    return this.http.get<Supplier>(this.resolveUrl(id));
  }

  /**
   * Creates a new supplier.
   */
  createSupplier(supplierData: any): Observable<Supplier> {
    // Note: Use FormData if images are involved, or JSON otherwise.
    let headers = {};
    if (!(supplierData instanceof FormData)) {
      headers = { 'Content-Type': 'application/ld+json' };
    }
    return this.http.post<Supplier>(this.apiUrl, supplierData, { headers });
  }

  /**
   * Updates an existing supplier.
   */
  updateSupplier(id: string | number, supplierData: any): Observable<Supplier> {
    let headers = {};
    if (!(supplierData instanceof FormData)) {
      headers = { 'Content-Type': 'application/merge-patch+json' };
    }
    return this.http.patch<Supplier>(this.resolveUrl(id), supplierData, { headers });
  }

  /**
   * Deletes a supplier.
   */
  deleteSupplier(id: string | number): Observable<void> {
    return this.http.delete<void>(this.resolveUrl(id));
  }
}
