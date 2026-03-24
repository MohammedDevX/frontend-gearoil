import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  imports: [RouterLink, RouterModule],
  standalone: true,
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss',
})
export class MainMenu {

}
