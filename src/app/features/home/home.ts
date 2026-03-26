import { Component, ViewChildren, QueryList, ElementRef, AfterViewInit, OnInit, inject } from '@angular/core';
import { ProductCardComponent } from '../../shared/product-card/product-card';
import { ProductService } from '../../core/services/product.service';
import { ProductHome } from '../../core/models/product-home.model';
import Swiper from 'swiper/bundle';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ ProductCardComponent, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit, AfterViewInit {
  @ViewChildren('carouselContainer') carousels!: QueryList<ElementRef>;
  swiperInstances: Swiper[] = [];

  private productService = inject(ProductService);
  activeProducts: ProductHome[] = [];

  ngOnInit() {
    this.productService.getHomeProducts().subscribe({
      next: (products) => {
        console.log('Products fetched from /api/products/home:', products);
        this.activeProducts = products;
        // Re-init swipers after data loads
        setTimeout(() => this.initSwipers(), 100);
      },
      error: (err) => console.error('Failed to load home products:', err),
    });
  }

  ngAfterViewInit() {
    this.initSwipers();
  }

  initSwipers() {
    // Destroy existing instances before re-init
    this.swiperInstances.forEach((s) => s.destroy(true, true));
    this.swiperInstances = [];

    this.carousels.forEach((carousel, index) => {
      const productCount = this.activeProducts.length;
      
      const swiper = new Swiper(carousel.nativeElement, {
        modules: [Navigation, Pagination, Autoplay],
        slidesPerView: 1,
        spaceBetween: 20,
        loop: productCount > 1,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: { enabled: false },
        navigation: (productCount <= 1) ? { enabled: false } : {
          nextEl: `.js-swiper-next-${index}`,
          prevEl: `.js-swiper-prev-${index}`,
          enabled: true
        },
        breakpoints: {
          480: { slidesPerView: Math.min(productCount, 2) },
          768: { slidesPerView: Math.min(productCount, 3) },
          992: { slidesPerView: Math.min(productCount, 4) },
          1200: { slidesPerView: (index === 1) ? Math.min(productCount, 4) : Math.min(productCount, 5) },
        },
      });
      this.swiperInstances.push(swiper);
    });
  }

  // Maintaining this for backward compatibility or direct calls if needed,
  // though Swiper handles it via nextEl/prevEl
  scrollCarousel(index: number, direction: 'left' | 'right') {
    const swiper = this.swiperInstances[index];
    if (swiper) {
      if (direction === 'left') {
        swiper.slidePrev();
      } else {
        swiper.slideNext();
      }
    }
  }
}
