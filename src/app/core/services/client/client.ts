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

  getAllClients(): Observable<IClient[]> {
    return this.http.get<IClient[]>(`${this.url}/clients`);
  }

  blockClient(id: string): Observable<unknown> {
    return this.http.patch(`${this.url}/client/blocked/${id}`, {});
  }
}
