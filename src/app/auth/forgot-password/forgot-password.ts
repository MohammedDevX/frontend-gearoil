import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  submitted = false;
  emailSentStatus = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    @Inject(AuthService) private authService: AuthService,
    private notify: NotificationService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.forgotPasswordForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) return;

    const email = this.forgotPasswordForm.get('Email')?.value as string;
    this.loading = true;
    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.loading = false;
        this.emailSentStatus = true;
        this.notify.success('Check your email to reset your password.');
      },
      error: (err: any) => {
        this.loading = false;
        this.notify.error(err);
      }
    });
  }
}
