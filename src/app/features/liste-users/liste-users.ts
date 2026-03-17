import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AppSidebarComponent } from '../../shared/app-sidebar/app-sidebar.component';
import { SidebarService } from '../../core/services/sidebar.service';
import { AppHeaderComponent } from '../../shared/admin-header/app-header/app-header.component';
import { Client } from '../../core/services/client/client';
import { IClient } from '../../models/IClient';
import { Subscription, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

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
  standalone: true,
})


export class ListeUsers implements OnInit {
  selected: string[] = [];
  sort: Sort = { key: 'nom', asc: true };
  page: number = 1;
  perPage: number = 10;
  
  isExpanded$!: Observable<boolean>;
  isHovered$!: Observable<boolean>;
  isMobileOpen$!: Observable<boolean>;

  listeClients: IClient[] = [];
  totalCount: number = 0;
  
  private refresh$ = new BehaviorSubject<void>(undefined);
  private querySubscription!: Subscription;

  constructor(
    public sidebarService: SidebarService, 
    private client: Client,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isHovered$ = this.sidebarService.isHovered$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  ngOnInit() {
    this.querySubscription = combineLatest([
      this.route.queryParams,
      this.refresh$
    ]).pipe(
      tap(([params]) => {
        this.page = +params['pageNumber'] || 1;
        this.perPage = +params['pageSize'] || 10;
        this.sort = {
          key: (params['sortBy'] as keyof IClient) || 'nom',
          asc: params['isAsc'] === undefined ? true : params['isAsc'] === 'true'
        };
      }),
      switchMap(([params]) => {
        const page = +params['pageNumber'] || 1;
        const perPage = +params['pageSize'] || 10;
        const sortBy = (params['sortBy'] as keyof IClient) || 'nom';
        const isAsc = params['isAsc'] === undefined ? true : params['isAsc'] === 'true';
        
        return this.client.getAllClients(page, perPage, sortBy, isAsc);
      })
    ).subscribe({
      next: (data) => {
        this.listeClients = data.items;
        this.totalCount = data.totalCount;
        // FORCE change detection to fix the "double-click" bug
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load clients', err);
      }
    });
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

  loadClients() {
    this.refresh$.next();
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.perPage));
  }

  getPageNumbers(): number[] {
    const pages = this.totalPages();
    return Array.from({ length: pages }, (_, i) => i + 1);
  }


  isAllSelected(): boolean {
    const ids = this.listeClients.map((p: IClient) => p.userId);
    return ids.length > 0 && ids.every((id: string) => this.selected.includes(id));
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
    // Optimistic update
    const originalList = [...this.listeClients];
    this.listeClients = this.listeClients.map((client) =>
      client.userId === userId ? { ...client, isBlocled: !client.isBlocled } : client
    );

    this.client.toggleBlockClient(userId).subscribe({
      next: () => {
        console.log('Status updated successfully for user:', userId);
      },
      error: (error: unknown) => {
        console.error('Failed to toggle block status', error);
        // Revert on error
        this.listeClients = originalList;
        this.cdr.detectChanges();
      },
    });
  }

  toggleBulkBlock(): void {
    if (this.selected.length === 0) return;

    this.client.toggleBlockMultipleClients(this.selected).subscribe({
      next: () => {
        console.log('Bulk status update successful for users:', this.selected);
        this.selected = []; // Clear selection
        this.loadClients(); // Refresh list to get new statuses
      },
      error: (error: unknown) => {
        console.error('Failed to toggle bulk block status', error);
      },
    });
  }

  toggleAll(): void {
    const ids = this.listeClients.map((p: IClient) => p.userId);
    this.selected = this.isAllSelected()
      ? this.selected.filter((id: string) => !ids.includes(id))
      : [...new Set([...this.selected, ...ids])];
  }

  startItem(): number {
    return !this.listeClients || this.listeClients.length === 0 ? 0 : (this.page - 1) * this.perPage + 1;
  }

  endItem(): number {
    return Math.min(this.page * this.perPage, this.totalCount);
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
