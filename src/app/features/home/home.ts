import { Component } from '@angular/core';
import { Header } from '../../shared/header/header';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Header],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {}