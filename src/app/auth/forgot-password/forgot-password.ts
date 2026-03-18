import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

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
    private authService: AuthService,
    private toastr: ToastrService,
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
        this.toastr.success('Check your email to reset your password.');
      },
      error: (err: Error) => {
        this.loading = false;
        this.toastr.error(err.message ?? 'Something went wrong. Please try again.');
      }
    });
  }
}
