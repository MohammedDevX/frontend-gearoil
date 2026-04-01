import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LivraisonService, Livraison } from '../../core/services/livraison.service';

declare var google: any;

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracking.html',
  styleUrl: './tracking.scss'
})
export class TrackingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private livraisonService = inject(LivraisonService);

  livraison?: Livraison;
  map: any;
  userMarker: any;
  livreurMarker: any;
  directionsService: any;
  directionsRenderer: any;
  eta: string = 'Calculating...';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.livraisonService.getLivraison(+id).subscribe(data => {
        this.livraison = data;
        this.initTrackingMap();
      });
    }
  }

  initTrackingMap() {
    if (!this.livraison) return;

    const userLocation = { lat: this.livraison.latitude, lng: this.livraison.longitude };
    const initialLivreurLocation = { lat: 34.6867, lng: -1.9114 }; // Start at Oujda center for simulation

    this.map = new google.maps.Map(document.getElementById('tracking-map') as HTMLElement, {
      zoom: 14,
      center: userLocation,
    });

    this.userMarker = new google.maps.Marker({
      position: userLocation,
      map: this.map,
      label: 'U',
      title: 'Your Location'
    });

    this.livreurMarker = new google.maps.Marker({
      position: initialLivreurLocation,
      map: this.map,
      icon: 'http://maps.google.com/mapfiles/ms/icons/truck.png',
      title: 'Livreur'
    });

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: true
    });

    this.calculateRoute(initialLivreurLocation, userLocation);

    // Simulate movement
    this.simulateMovement(initialLivreurLocation, userLocation);
  }

  calculateRoute(start: any, end: any) {
    this.directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response: any, status: string) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(response);
          this.eta = response.routes[0].legs[0].duration.text;
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );
  }

  simulateMovement(start: any, end: any) {
    let fraction = 0;
    const interval = setInterval(() => {
      fraction += 0.05;
      if (fraction >= 1) {
        clearInterval(interval);
        this.eta = 'Arrived';
        return;
      }

      const currentLat = start.lat + (end.lat - start.lat) * fraction;
      const currentLng = start.lng + (end.lng - start.lng) * fraction;
      const newPos = { lat: currentLat, lng: currentLng };

      this.livreurMarker.setPosition(newPos);
      // In a real app, you'd re-calculate the route or just update the distance/time
    }, 5000);
  }
}
