import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService, ResetPasswordDTO } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  email = '';
  token = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.resetForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.email = params.get('email') ?? '';
      this.token = params.get('token') ?? '';

      if (!this.email || !this.token) {
        this.toastr.error('Lien de réinitialisation invalide ou expiré.');
      }
    });
  }

  get f() {
    return this.resetForm.controls;
  }

  private passwordsMatchValidator(group: FormGroup) {
    const pwd = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pwd && confirm && pwd === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.resetForm.invalid || !this.email || !this.token) {
      return;
    }

    const payload: ResetPasswordDTO = {
      email: this.email,
      token: this.token,
      newPassword: this.resetForm.get('newPassword')?.value,
    };

    this.authService.resetPassword(payload).subscribe({
      next: () => {
        this.toastr.success('Votre mot de passe a été modifié avec succès.');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err: Error) => {
        this.toastr.error(err.message ?? 'Impossible de réinitialiser le mot de passe.');
      },
    });
  }
}

