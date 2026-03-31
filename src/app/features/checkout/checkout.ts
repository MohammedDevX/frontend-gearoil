import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { PaymentService } from '../../core/services/payment.service';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrls: []
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  private cartService = inject(CartService);
  private paymentService = inject(PaymentService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  cart$ = this.cartService.cart$;
  totalPrice = 0;
  
  checkoutForm!: FormGroup;
  selectedPaymentMethod: 'CARD' | 'PAYPAL' = 'CARD';

  // Stripe Integration
  @ViewChild('cardInfo') cardInfo!: ElementRef;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;
  cardError: string | null = null;

  isProcessing = false;
  paymentSuccess = false;
  mockOrderId = Math.floor(Math.random() * 10000); // Simulated order ID for the Spring Boot Service

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });

    this.cart$.subscribe((cart: any) => {
      this.totalPrice = cart ? cart.totalPrice : 0;
    });
  }

  async ngAfterViewInit() {
    // Make sure to replace this with your real Stripe Publishable key!
    this.stripe = await loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
    
    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.cardElement = this.elements.create('card', {
        style: {
          base: {
            iconColor: '#666EE8',
            color: '#31325F',
            fontWeight: '300',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSize: '16px',
            '::placeholder': { color: '#CFD7E0' }
          }
        }
      });
      this.cardElement.mount(this.cardInfo.nativeElement);
      
      this.cardElement.on('change', (event: any) => {
        this.cardError = event.error ? event.error.message : null;
      });
    }
  }

  setPaymentMethod(method: 'CARD' | 'PAYPAL') {
    this.selectedPaymentMethod = method;
  }

  async processPayment() {
    if (this.checkoutForm.invalid || this.totalPrice === 0) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;

    // 1. Ask Spring Boot for Payment Intent
    this.paymentService.createIntent({
      orderId: this.mockOrderId,
      amount: this.totalPrice,
      paymentMethod: this.selectedPaymentMethod
    }).subscribe({
      next: async (intentResponse: any) => {
        
        let paymentStatus: 'SUCCESS' | 'FAILED' | 'PENDING' = 'FAILED';

        if (this.selectedPaymentMethod === 'CARD' && this.stripe && this.cardElement && !intentResponse.clientSecret.startsWith('fake')) {
          // Real Stripe Execution
          const result = await this.stripe.confirmCardPayment(intentResponse.clientSecret, {
            payment_method: {
              card: this.cardElement,
              billing_details: {
                name: `${this.checkoutForm.value.firstName} ${this.checkoutForm.value.lastName}`,
                email: this.checkoutForm.value.email
              }
            }
          });

          if (result.error) {
            this.cardError = result.error.message || 'Payment failed';
            paymentStatus = 'FAILED';
          } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
            paymentStatus = 'SUCCESS';
          }
        } else {
          // Simulation / PayPal fallback processing
          paymentStatus = 'SUCCESS'; // Fallback simulates success
        }

        // 2. Confirm to Spring Boot DB
        this.paymentService.confirmPayment({
          transactionId: intentResponse.transactionId,
          status: paymentStatus,
          orderId: this.mockOrderId,
          amount: this.totalPrice,
          paymentMethod: this.selectedPaymentMethod
        }).subscribe({
          next: (confirmRes: any) => {
             if(confirmRes.status === 'SUCCESS') {
                this.paymentSuccess = true;
                this.cartService.clearCart().subscribe(); // clear cart properly
             } else {
                this.cardError = 'Payment was declined or failed backend verification';
             }
             this.isProcessing = false;
          },
          error: () => {
             this.cardError = 'Server error during confirmation';
             this.isProcessing = false;
          }
        });
      },
      error: (err: any) => {
        this.cardError = 'Could not securely connect to the payment server.';
        this.isProcessing = false;
        console.error(err);
      }
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
