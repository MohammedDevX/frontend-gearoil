import { Component, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationDropdownComponent } from '../notification-dropdown/notification-dropdown.component';
import { UserDropdownComponent } from '../user-dropdown/user-dropdown.component';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-admin-header',
  imports: [
    CommonModule,
    RouterModule,
    NotificationDropdownComponent,
    UserDropdownComponent,
  ],
  templateUrl: './app-header.component.html',
  standalone: true,
  styles: [`
    header.sticky {
      will-change: transform;
      contain: layout;
    }
  `]
})
export class AppHeaderComponent {
  isApplicationMenuOpen = false;
  readonly isMobileOpen$;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(
    public sidebarService: SidebarService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  handleToggle() {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth >= 1280) {
        this.sidebarService.toggleExpanded();
      } else {
        this.sidebarService.toggleMobileOpen();
      }
    }
  }

  toggleApplicationMenu() {
    this.isApplicationMenuOpen = !this.isApplicationMenuOpen;
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('keydown', this.handleKeyDown);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      if (isPlatformBrowser(this.platformId)) {
        this.searchInput?.nativeElement.focus();
      }
    }
  };
}
