import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Livraison {
  id?: number;
  orderId: number;
  status: string;
  address: string;
  city: string;
  deliveryDate: string;
  latitude: number;
  longitude: number;
  deliveryPrice?: number;
  livreurId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private http = inject(HttpClient);
  private apiUrl = '/api/livraisons'; // Adjusted for proxy if necessary

  createLivraison(livraison: Livraison): Observable<Livraison> {
    return this.http.post<Livraison>(this.apiUrl, livraison);
  }

  getLivraison(id: number): Observable<Livraison> {
    return this.http.get<Livraison>(`${this.apiUrl}/${id}`);
  }

  getLivraisons(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(this.apiUrl);
  }
}
