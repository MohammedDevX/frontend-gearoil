import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../core/services/token.service';
import { LivraisonService, Livraison } from '../../core/services/livraison.service';

@Component({
  selector: 'app-livreur-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './livreur-dashboard.html',
  styleUrl: './livreur-dashboard.scss'
})
export class LivreurDashboardComponent implements OnInit {
  private tokenService = inject(TokenService);
  private livraisonService = inject(LivraisonService);

  driverName: string = '';
  driverEmail: string = '';
  stats = {
    total: 0,
    active: 0,
    completed: 0
  };
  recentDeliveries: Livraison[] = [];

  ngOnInit() {
    this.driverEmail = this.tokenService.getUserEmail() || 'driver@gearoil.com';
    this.driverName = this.driverEmail.split('@')[0];
    
    // Simulate fetching driver stats and deliveries
    this.livraisonService.getLivraisons().subscribe((data: Livraison[]) => {
      this.recentDeliveries = data.slice(0, 5);
      this.stats.total = data.length;
      this.stats.active = data.filter((l: Livraison) => l.status === 'PENDING' || l.status === 'SHIPPED').length;
      this.stats.completed = data.filter((l: Livraison) => l.status === 'DELIVERED').length;
    });
  }
}
