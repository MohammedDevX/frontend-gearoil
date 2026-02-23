import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './set-password.html',
  styleUrls: ['./set-password.scss']
})
export class SetPasswordComponent implements OnInit {

  userId: string = '';
  token: string = '';
  password: string = '';
  showPw: boolean = false;

  strengthScore = 0;
  strengthLabel = '— Entrez un mot de passe';
  strengthColor = '#4a5070';

  get hasUpper() { return /[A-Z]/.test(this.password); }
  get hasDigit() { return /[0-9]/.test(this.password); }
  get hasSpecial() { return /[^A-Za-z0-9]/.test(this.password); }

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.token = params['token'];
    });
  }

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

  setPassword() {
    this.authService.setPassword({
      userId: this.userId,
      token: this.token,
      password: this.password
    }).subscribe({
      next: () => alert('Mot de passe défini avec succès ! Vous pouvez maintenant vous connecter.'),
      error: err => {
        const msg = err.error?.title || JSON.stringify(err.error) || err.message;
        alert('Erreur : ' + msg);
      }
    });
  }
}