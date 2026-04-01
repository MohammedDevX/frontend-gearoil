import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LivraisonService, Livraison } from '../../core/services/livraison.service';
import { CartService } from '../../core/services/cart.service';
import { take } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class CheckoutComponent implements OnInit {
  private livraisonService = inject(LivraisonService);
  private cartService = inject(CartService);
  private router = inject(Router);

  deliveryDate: string = '';
  address: string = '';
  city: string = 'Oujda'; // Default city
  lat: number = 34.6867; // Default to Oujda
  lng: number = -1.9114;
  map: any;
  marker: any;
  estimatedPrice: number = 0;

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    const loader = (window as any).google;
    if (loader) {
      this.renderMap();
    } else {
      // If scripts not loaded, you might need to load it dynamically or assume it's in index.html
      console.error('Google Maps API not loaded');
    }
  }

  renderMap() {
    const oujda = { lat: this.lat, lng: this.lng };
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      zoom: 13,
      center: oujda,
    });

    this.marker = new google.maps.Marker({
      position: oujda,
      map: this.map,
      draggable: true
    });

    this.map.addListener('click', (event: any) => {
      this.updatePosition(event.latLng.lat(), event.latLng.lng());
    });

    this.marker.addListener('dragend', (event: any) => {
      this.updatePosition(event.latLng.lat(), event.latLng.lng());
    });
  }

  updatePosition(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
    this.marker.setPosition({ lat, lng });
    // In a real app, you'd call a service to estimate price here if needed before submission
  }

  confirmOrder() {
    this.cartService.cart$.pipe(take(1)).subscribe(cart => {
      const livraison: Livraison = {
        orderId: 1001, // In a real app, this would be the actual order ID
        status: 'PENDING',
        address: this.address,
        city: this.city,
        deliveryDate: this.deliveryDate,
        latitude: this.lat,
        longitude: this.lng
      };

      this.livraisonService.createLivraison(livraison).subscribe({
        next: (res) => {
          console.log('Livraison created', res);
          // Navigate to tracking
          this.router.navigate(['/track-order', res.id]);
        },
        error: (err) => console.error('Error creating livraison', err)
      });
    });
  }
}
