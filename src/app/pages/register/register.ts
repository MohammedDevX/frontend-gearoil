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

  accepted = false;
  strengthScore = 0;
  strengthLabel = '— Entrez un mot de passe';
  strengthColor = '#4a5070';

  constructor(private authService: AuthService) {}

  checkStrength(pw: string) {
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;

    this.strengthScore = s;

    const labels = ['— Entrez un mot de passe', 'Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort ✓'];
    const colors = ['#4a5070', '#ff4d1c', '#e07a20', '#e0b020', '#40c060', '#40c060'];

    this.strengthLabel = pw ? labels[s] : labels[0];
    this.strengthColor = pw ? colors[s] : colors[0];
  }

  register() {
    if (!this.accepted) {
      alert('Veuillez accepter les conditions d\'utilisation.');
      return;
    }

    this.authService.registerClient(this.model)
      .subscribe({
        next: () => alert('Client enregistré avec succès !'),
        error: err => {
          const msg = err.error?.title || JSON.stringify(err.error) || err.message;
          alert('Erreur : ' + msg);
        }
      });
  }
}