import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IClient } from '../../../models/IClient';

@Injectable({
  providedIn: 'root',
})
export class Client {
  private url = "http://localhost:5000";

  constructor(private http: HttpClient) {}

  getAllClients(pageNumber: number = 1, pageSize: number = 10, sortBy: string = 'nom', isAsc: boolean = true): Observable<{ items: IClient[], totalCount: number }> {
    return this.http.get<{ items: IClient[], totalCount: number }>(`${this.url}/client`, {
      params: {
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        sortBy: sortBy,
        isAsc: isAsc.toString()
      }
    });
  }

  toggleBlockClient(id: string): Observable<unknown> {
    return this.http.patch(`${this.url}/client/${id}`, {});
  }

  toggleBlockMultipleClients(ids: string[]): Observable<unknown> {
    return this.http.patch(`${this.url}/client`, ids);
  }
}
