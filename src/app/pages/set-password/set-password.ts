import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './set-password.html',
  styleUrls: ['./set-password.scss']
})
export class SetPasswordComponent implements OnInit {

  userId: string = '';
  token: string = '';
  password: string = '';

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

  setPassword() {
    this.authService.setPassword({
      userId: this.userId,
      token: this.token,
      password: this.password
    }).subscribe({
      next: () => alert("Password set successfully"),
      error: err => {
        const msg = err.error?.title || JSON.stringify(err.error) || err.message;
        alert("Error: " + msg);
      }
    });
  }
}