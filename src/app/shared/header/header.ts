import { Component, HostListener  } from '@angular/core';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrls: ['./header.scss','./mobile_header.scss']
})
export class Header {
    isDepartmentsOpen: boolean = false;

    toggleDepartments(event: Event) {
      event.stopPropagation();
      this.isDepartmentsOpen = !this.isDepartmentsOpen;
    }

    closeDepartments() { 
      this.isDepartmentsOpen = false;
    }
      @HostListener('document:click')
  onDocumentClick() {
    this.closeDepartments();
  }

}
