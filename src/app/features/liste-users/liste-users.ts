import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppSidebarComponent } from '../../shared/app-sidebar/app-sidebar.component';
import { SidebarService } from '../../core/services/sidebar.service';
import { AppHeaderComponent } from '../../shared/admin-header/app-header/app-header.component';
import { Client } from '../../core/services/client/client';
import { IClient } from '../../models/IClient';

interface Sort {
  key: keyof IClient;
  asc: boolean;
}


@Component({
  selector: 'app-liste-users',
  imports: [
    CommonModule,
    RouterModule,
    AppSidebarComponent,
    AppHeaderComponent,
  ],
  templateUrl: './liste-users.html',
  styleUrl: './liste-users.scss',
})


export class ListeUsers {
  selected: string[] = [];
  sort: Sort = { key: 'nom', asc: true };
  page: number = 1;
  perPage: number = 7;
  showFilter: boolean = false;
  
  isExpanded$;
  isHovered$;
  isMobileOpen$;

  listeClients!: IClient[];

  constructor(public sidebarService: SidebarService, private client: Client) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isHovered$ = this.sidebarService.isHovered$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  ngOnInit() {
    this.client.getAllClients().subscribe((data: IClient[]) => {
      this.listeClients = data;
      console.log(this.listeClients);
    });
  }

  sortedUsers(): IClient[] {
    if (!this.listeClients) return [];
    return [...this.listeClients].sort((a, b) => {
      const valA = a[this.sort.key];
      const valB = b[this.sort.key];
      
      if (typeof valA === 'boolean' && typeof valB === 'boolean') {
        return this.sort.asc ? (valA === valB ? 0 : valA ? 1 : -1) : (valA === valB ? 0 : valA ? -1 : 1);
      }
      
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      
      if (strA < strB) return this.sort.asc ? -1 : 1;
      if (strA > strB) return this.sort.asc ? 1 : -1;
      return 0;
    });
  }

  paginatedUsers(): IClient[] {
    const start = (this.page - 1) * this.perPage;
    return this.sortedUsers().slice(start, start + this.perPage);
  }

  totalPages(): number {
    return this.listeClients ? Math.ceil(this.listeClients.length / this.perPage) : 0;
  }

  selectedClients(): IClient[] {
    if (!this.listeClients) return [];
    return this.listeClients.filter((client) => this.selected.includes(client.userId));
  }

  goToPage(n: number): void {
    if (n >= 1 && n <= this.totalPages()) {
      this.page = n;
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages()) {
      this.page++;
    }
  }

  isAllSelected(): boolean {
    const ids = this.paginatedUsers().map((p) => p.userId);
    return ids.length > 0 && ids.every((id) => this.selected.includes(id));
  }

  toggleSelect(id: string): void {
    const isAlreadySelected = this.selected.includes(id);

    this.selected = isAlreadySelected
      ? this.selected.filter((i) => i !== id)
      : [...this.selected, id];

    if (!isAlreadySelected) {
      console.log('Checked userId:', id);
    }
  }

  toggleBlockClient(userId: string): void {
    this.client.blockClient(userId).subscribe({
      next: () => {
        this.listeClients = this.listeClients.map((client) =>
          client.userId === userId ? { ...client, isBlocled: !client.isBlocled } : client
        );
      },
      error: (error: unknown) => {
        console.error('Failed to toggle block status', error);
      },
    });
  }

  toggleAll(): void {
    const ids = this.paginatedUsers().map((p) => p.userId);
    this.selected = this.isAllSelected()
      ? this.selected.filter((id) => !ids.includes(id))
      : [...new Set([...this.selected, ...ids])];
  }

  startItem(): number {
    return !this.listeClients || this.listeClients.length === 0 ? 0 : (this.page - 1) * this.perPage + 1;
  }

  endItem(): number {
    return this.listeClients ? Math.min(this.page * this.perPage, this.listeClients.length) : 0;
  }

  sortBy(key: keyof IClient): void {
    this.sort = {
      key,
      asc: this.sort.key === key ? !this.sort.asc : true,
    };
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

   handleViewMore() {
    console.log('View More clicked');
    // Add your view more logic here
  }

  handleDelete() {
    console.log('Delete clicked');
    // Add your delete logic here
  }
}
