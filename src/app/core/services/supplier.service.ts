import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Supplier, SupplierResponse } from '../../models/supplier.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private readonly apiUrl = `http://localhost:5000/suppliers`;


  constructor(private http: HttpClient) {}

  /**
   * Fetches the list of suppliers with optional pagination and filtering.
   * Following clean architecture principles and best practices.
   */
  getSuppliers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  /**
   * Fetches a single supplier by ID.
   */
  getSupplierById(id: string | number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new supplier.
   * Note: This usually requires a FormData object if an image is involved.
   */
  createSupplier(supplierData: FormData): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplierData);
  }

  /**
   * Updates an existing supplier.
   */
  updateSupplier(id: string | number, supplierData: any): Observable<Supplier> {
    return this.http.patch<Supplier>(`${this.apiUrl}/${id}`, supplierData);
  }

  /**
   * Deletes a supplier.
   */
  deleteSupplier(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
