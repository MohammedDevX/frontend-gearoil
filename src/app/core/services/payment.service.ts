import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentIntentRequest {
  orderId: number;
  amount: number;
  paymentMethod: 'CARD' | 'PAYPAL';
}

export interface PaymentIntentResponse {
  clientSecret: string;
  transactionId: string;
}

export interface PaymentConfirmRequest {
  transactionId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  orderId: number;
  amount: number;
  paymentMethod: 'CARD' | 'PAYPAL';
}

export interface PaymentConfirmResponse {
  transactionId: string;
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  // Re-route via Angular proxy defined in proxy.conf.json
  private readonly PAIEMENT_API_URL = '/api/payments';

  createIntent(request: PaymentIntentRequest): Observable<PaymentIntentResponse> {
    return this.http.post<PaymentIntentResponse>(`${this.PAIEMENT_API_URL}/create-intent`, request);
  }

  confirmPayment(request: PaymentConfirmRequest): Observable<PaymentConfirmResponse> {
    return this.http.post<PaymentConfirmResponse>(`${this.PAIEMENT_API_URL}/confirm`, request);
  }
}
