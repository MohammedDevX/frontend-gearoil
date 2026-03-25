import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Supplier, SupplierResponse } from '../../models/supplier.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private readonly apiUrl = `${environment.apiUrl}/supplier`;

  // Mock data for testing
  private mockSuppliers: Supplier[] = [
    {
      id: 1,
      nameSupplier: 'Global Logistics Oil',
      email: 'contact@globallogistics.com',
      phone: '+33 1 23 45 67 89',
      address: '123 Avenue de Paris, 75001 Paris',
      status: 'Active',
      imageUrl: 'https://i.pravatar.cc/150?u=1'
    },
    {
      id: 2,
      nameSupplier: 'Speedy Parts Sarl',
      email: 'sales@speedyparts.fr',
      phone: '+33 1 98 76 54 32',
      address: '45 Rue de la Pompe, 69002 Lyon',
      status: 'Active',
      imageUrl: 'https://i.pravatar.cc/150?u=2'
    },
    {
      id: 3,
      nameSupplier: 'Lubricants Express',
      email: 'info@lubexpress.com',
      phone: '+33 2 40 50 60 70',
      address: '8 Boulevard Maritime, 44000 Nantes',
      status: 'Inactive',
      imageUrl: 'https://i.pravatar.cc/150?u=3'
    },
    {
      id: 4,
      nameSupplier: 'Oil & Gas Solutions',
      email: 'support@ogsolutions.com',
      phone: '+33 4 13 24 35 46',
      address: '22 Chemin du Littoral, 13015 Marseille',
      status: 'Active',
      imageUrl: 'https://i.pravatar.cc/150?u=4'
    },
    {
      id: 5,
      nameSupplier: 'Auto Tech Supplies',
      email: 'admin@autotech.be',
      phone: '+32 2 111 22 33',
      address: 'Rue Royale 10, 1000 Bruxelles',
      status: 'Active',
      imageUrl: 'https://i.pravatar.cc/150?u=5'
    },
    {
      id: 6,
      nameSupplier: 'Premium Gear Co',
      email: 'contact@premiumgear.com',
      phone: '+49 30 1234567',
      address: 'Friedrichstraße 100, 10117 Berlin',
      status: 'Inactive',
      imageUrl: 'https://i.pravatar.cc/150?u=6'
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * Fetches the list of suppliers with optional pagination and filtering.
   * Following clean architecture principles and best practices.
   */
  getSuppliers(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'nameSupplier',
    isAsc: boolean = true
  ): Observable<SupplierResponse> {
    // Return mock data for testing
    return of({
      items: this.mockSuppliers,
      totalCount: this.mockSuppliers.length
    });

    /* 
    // Backend Implementation:
    return this.http.get<SupplierResponse>(this.apiUrl, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        sortBy: sortBy,
        isAsc: isAsc.toString(),
      },
    });
    */
  }

  /**
   * Fetches a single supplier by ID.
   */
  getSupplierById(id: string | number): Observable<Supplier> {
    const supplier = this.mockSuppliers.find(s => s.id === id);
    if (supplier) return of(supplier);
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new supplier.
   * Note: This usually requires a FormData object if an image is involved.
   */
  createSupplier(supplierData: Partial<Supplier>): Observable<Supplier> {
    const newSupplier: Supplier = {
      id: this.mockSuppliers.length + 1,
      nameSupplier: supplierData.nameSupplier || 'New Supplier',
      email: supplierData.email || '',
      phone: supplierData.phone || '',
      address: supplierData.address || '',
      status: 'Active',
      imageUrl: `https://i.pravatar.cc/150?u=${this.mockSuppliers.length + 1}`
    };
    this.mockSuppliers.unshift(newSupplier); // Add to the beginning
    return of(newSupplier);
    // return this.http.post<Supplier>(this.apiUrl, supplierData);
  }

  /**
   * Updates an existing supplier.
   */
  updateSupplier(id: string | number, supplierData: Partial<Supplier>): Observable<Supplier> {
    const index = this.mockSuppliers.findIndex(s => s.id === id);
    if (index !== -1) {
      this.mockSuppliers[index] = { ...this.mockSuppliers[index], ...supplierData };
      return of(this.mockSuppliers[index]);
    }
    return this.http.patch<Supplier>(`${this.apiUrl}/${id}`, supplierData);
  }

  /**
   * Deletes a supplier.
   */
  deleteSupplier(id: string | number): Observable<void> {
    // Simulate local deletion for testing
    this.mockSuppliers = this.mockSuppliers.filter(s => s.id !== id);
    return of(undefined);
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
