import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { TableDropdownComponent } from '../../ui/table-dropdown/table-dropdown.component';
import { SupplierService } from '../../core/services/supplier.service';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, BadgeComponent, ButtonComponent, TableDropdownComponent],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.scss'
})
export class SuppliersComponent implements OnInit {
  suppliers: Supplier[] = [];
  isLoading = true;
  error: string | null = null;

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.fetchSuppliers();
  }

  fetchSuppliers(): void {
    this.isLoading = true;
    this.error = null;
    this.supplierService.getSuppliers().subscribe({
      next: (response) => {
        this.suppliers = response.items;
        this.totalPages = Math.ceil(this.suppliers.length / this.pageSize) || 1;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load suppliers. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching suppliers:', err);
      }
    });
  }

  get currentItems(): Supplier[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.suppliers.slice(startIndex, startIndex + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getBadgeColor(status: string | undefined): 'success' | 'error' | 'info' {
    if (status === 'Active') return 'success';
    if (status === 'Inactive') return 'error';
    return 'info';
  }

  onEdit(supplier: Supplier) {
    console.log('Edit supplier:', supplier);
  }

  onDelete(supplier: Supplier) {
    if (confirm(`Are you sure you want to delete ${supplier.nameSupplier}?`)) {
      this.supplierService.deleteSupplier(supplier.id).subscribe({
        next: () => {
          this.suppliers = this.suppliers.filter(s => s.id !== supplier.id);
          this.totalPages = Math.ceil(this.suppliers.length / this.pageSize) || 1;
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages || 1;
          }
        },
        error: (err) => {
          console.error('Error deleting supplier:', err);
        }
      });
    }
  }
}
