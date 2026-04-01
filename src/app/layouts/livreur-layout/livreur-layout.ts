import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppSidebarComponent } from '../../shared/app-sidebar/app-sidebar.component';
import { AppHeaderComponent } from '../../shared/admin-header/app-header/app-header.component';
import { SidebarService } from '../../core/services/sidebar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-livreur-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AppSidebarComponent, AppHeaderComponent],
  templateUrl: './livreur-layout.html',
})
export class LivreurLayoutComponent {
  isExpanded$: Observable<boolean>;
  isHovered$: Observable<boolean>;
  isMobileOpen$: Observable<boolean>;

  constructor(public sidebarService: SidebarService) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isHovered$ = this.sidebarService.isHovered$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }
}
