import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../ui/button/button.component';
import { BadgeComponent } from '../../../ui/badge/badge.component';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, BadgeComponent],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  
  allProducts: any[] = [];
  loading = false;

  // Pagination & Search
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAllProducts(this.currentPage, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.allProducts = res['hydra:member'] || res['member'] || res.items || res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.loading = false;
      }
    });
  }

  populateMockData() {
    this.allProducts = [
      { id: '1', name: 'Premium Synthetic Oil 5W-30', date: 'Oct 24, 2023', price: '$45.00', category: 'Engine Oil', status: 'In Stock' },
      { id: '2', name: 'Standard Brake Fluid DOT 4', date: 'Oct 23, 2023', price: '$12.50', category: 'Brake Fluid', status: 'Low Stock' },
      { id: '3', name: 'ATF Transmission Fluid', date: 'Oct 22, 2023', price: '$22.00', category: 'Transmission', status: 'Out of Stock' },
      { id: '4', name: 'Coolant Antifreeze Green', date: 'Oct 20, 2023', price: '$18.99', category: 'Coolant', status: 'In Stock' },
      { id: '5', name: 'Heavy Duty Gear Oil 75W-90', date: 'Oct 19, 2023', price: '$35.50', category: 'Gear Oil', status: 'In Stock' },
      { id: '6', name: 'Power Steering Fluid', date: 'Oct 15, 2023', price: '$9.99', category: 'Steering', status: 'Low Stock' },
      { id: '7', name: 'Synthetic Blend Motor Oil 10W-40', date: 'Oct 14, 2023', price: '$28.00', category: 'Engine Oil', status: 'In Stock' },
      { id: '8', name: 'High Mileage Oil 5W-20', date: 'Oct 10, 2023', price: '$32.00', category: 'Engine Oil', status: 'In Stock' },
      { id: '9', name: 'Clutch Fluid Premium', date: 'Oct 05, 2023', price: '$14.99', category: 'Transmission', status: 'Out of Stock' },
      { id: '10', name: 'Diesel Engine Oil 15W-40', date: 'Oct 01, 2023', price: '$55.00', category: 'Engine Oil', status: 'In Stock' },
      { id: '11', name: 'Windshield Washer Fluid', date: 'Sep 28, 2023', price: '$4.50', category: 'Accessories', status: 'In Stock' },
      { id: '12', name: 'Performance Brake Fluid DOT 5.1', date: 'Sep 20, 2023', price: '$24.00', category: 'Brake Fluid', status: 'Low Stock' },
    ];
  }

  get filteredProducts() {
    if (!this.searchTerm.trim()) {
       return this.allProducts;
    }
    const term = this.searchTerm.toLowerCase().trim();
    return this.allProducts.filter(p => 
       p.name?.toLowerCase().includes(term) || 
       p.category?.toLowerCase().includes(term)
    );
  }

  get totalPages() {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage) || 1;
  }

  get pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get currentItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      // Optimistic delete for UX
      this.allProducts = this.allProducts.filter(p => p.id !== id);
      
      this.productService.deleteProduct(id).subscribe({
        error: () => console.warn('Mock optimistic delete: Backend API not reachable for DELETE.')
      });

      // Recalculate pagination if needed
      if (this.currentPage > this.totalPages) {
         this.currentPage = this.totalPages;
      }
    }
  }

  getBadgeColor(status: string): 'success' | 'warning' | 'error' | 'light' {
    if (status === 'In Stock') return 'success';
    if (status === 'Low Stock') return 'warning';
    if (status === 'Out of Stock') return 'error';
    return 'light';
  }
}
