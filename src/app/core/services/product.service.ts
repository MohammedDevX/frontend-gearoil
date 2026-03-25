import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductHome } from '../models/product-home.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  getHomeProducts(): Observable<ProductHome[]> {
    return this.http.get<any>('/api/products/home').pipe(
      map(response => response.member || response['hydra:member'] || [])
    );
  }
}
