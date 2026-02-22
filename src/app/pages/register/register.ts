import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {

  model = {
    nom: '',
    prenom: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService) {}

  register() {
    this.authService.registerClient(this.model)
      .subscribe({
        next: () => alert("Client registered successfully"),
        error: err => {
          const msg = err.error?.title || JSON.stringify(err.error) || err.message;
          alert("Error: " + msg);
        }
      });
  }
}