import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IClient } from '../../../models/IClient';

@Injectable({
  providedIn: 'root',
})
export class Client {
  private url = "http://localhost:5000";

  constructor(private http: HttpClient) {}

  getAllClients() {
    return this.http.get<IClient[]>(`${this.url}/clients`);
  }
}
