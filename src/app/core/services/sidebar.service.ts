import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isExpandedSubject = new BehaviorSubject<boolean>(true);
  private isMobileOpenSubject = new BehaviorSubject<boolean>(false);
  private isHoveredSubject = new BehaviorSubject<boolean>(false);

  isExpanded$ = this.isExpandedSubject.asObservable();
  isMobileOpen$ = this.isMobileOpenSubject.asObservable();
  isHovered$ = this.isHoveredSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      fromEvent(window, 'resize')
        .pipe(debounceTime(100))
        .subscribe(() => {
          if (window.innerWidth >= 1280 && this.isMobileOpenSubject.value) {
            this.setMobileOpen(false);
          }
        });
    }
  }

  setExpanded(val: boolean) {
    this.isExpandedSubject.next(val);
  }

  toggleExpanded() {
    this.isExpandedSubject.next(!this.isExpandedSubject.value);
  }

  setMobileOpen(val: boolean) {
    this.isMobileOpenSubject.next(val);
  }

  toggleMobileOpen() {
    this.isMobileOpenSubject.next(!this.isMobileOpenSubject.value);
  }

  setHovered(val: boolean) {
    this.isHoveredSubject.next(val);
  }
}
