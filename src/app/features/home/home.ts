import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Header],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {
  @ViewChildren('carouselContainer') carousels!: QueryList<ElementRef>;

  scrollCarousel(index: number, direction: 'left' | 'right') {
    const carousel = this.carousels.toArray()[index]?.nativeElement;
    if (carousel) {
      const scrollAmount = carousel.offsetWidth * 0.8; // Scroll 80% of visible width
      carousel.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }
}

