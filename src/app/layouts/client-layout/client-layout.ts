import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [RouterModule, Header],
  templateUrl: './client-layout.html',
})
export class ClientLayoutComponent {}
