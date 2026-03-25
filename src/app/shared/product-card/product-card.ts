import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductHome } from '../../core/models/product-home.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss'],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductHome;

  get stars(): boolean[] {
    const rating = Math.round(this.product.averageRating);
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}
