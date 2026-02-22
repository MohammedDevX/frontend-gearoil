import { Component } from '@angular/core';
import { NgIf, NgIfContext } from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
    isDepartmentsOpen = false;

    toggleDepartments(event: Event) {
      event.stopPropagation();
      this.isDepartmentsOpen = !this.isDepartmentsOpen;
    }

    closeDepartments() {
      this.isDepartmentsOpen = false;
    }


}
