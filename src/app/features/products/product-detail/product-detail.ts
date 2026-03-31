import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { IProduct } from '../../../models/IProduct';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail implements OnInit {
  product: IProduct | null = null;
  activeTab: string = 'description';
  quantity: number = 1;
  activeImageIndex: number = 0;

  // Gallery images (to be populated from product)
  images: any[] = [];

  // Related products (to be populated from service)
  relatedProducts: IProduct[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadProduct(id);
      }
    });

    this.loadRelatedProducts();
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (data: any) => {
        this.product = data as IProduct;
        this.setupGallery(this.product);
      },
      error: (err: any) => console.error('Error loading product', err)
    });
  }

  setupGallery(product: IProduct): void {
    // Backend only has one image for now, so we create an array with just that one
    // In a real scenario, we might have multiple images in the backend
    this.images = [
      {
        preview: product.urlImage,
        thumb: product.urlImage,
        full: product.urlImage
      }
    ];
    this.activeImageIndex = 0;
  }

  loadRelatedProducts(): void {
    this.productService.getActiveProducts().subscribe({
      next: (data) => {
        this.relatedProducts = data.filter(p => p.id !== this.product?.id).slice(0, 8);
      },
      error: (err) => console.error('Error loading related products', err)
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  increment(): void {
    this.quantity++;
  }

  decrement(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  setActiveImage(index: number): void {
    this.activeImageIndex = index;
  }

  scrollCarousel(direction: 'prev' | 'next'): void {
    const container = document.querySelector('.block-products-carousel__slider');
    if (container) {
      const scrollAmount = 300;
      if (direction === 'prev') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }

  // Helper for stars (simplified)
  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }
}
