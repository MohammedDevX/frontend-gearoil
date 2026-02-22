import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5001/api/Auth'; // بدل البورت إذا مختلف

  constructor(private http: HttpClient) {}

  registerClient(data: any) {
    return this.http.post(`${this.apiUrl}/register-client`, data);
  }

  setPassword(data: any) {
    return this.http.post(`${this.apiUrl}/set-password`, data);
  }
}