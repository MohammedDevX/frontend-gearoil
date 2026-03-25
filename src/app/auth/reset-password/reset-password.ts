import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';
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

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    @Inject(AuthService) private authService: AuthService,
    private notify: NotificationService,
    private router: Router,
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

      // ASP.NET Core generates base64 tokens with '+' signs. If the email template
      // doesn't URL-encode the token, browsers convert '+' to ' ' (space) in query params.
      // We must restore the '+' before sending it back to the server.
      const rawToken = params.get('token') ?? '';
      this.token = rawToken.replace(/ /g, '+');

      if (!this.email || !this.token) {
        this.notify.error({ message: 'Lien de réinitialisation invalide ou expiré.' }, 'Erreur');
        this.router.navigate(['/forgot-password']);
        return;
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
    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;
    const payload: ResetPasswordDTO = {
      email: this.email,
      token: this.token,
      newPassword: this.resetForm.get('newPassword')?.value,
    };

    console.log('📤 Payload envoyé:', JSON.stringify(payload, null, 2));

    this.authService.resetPassword(payload).subscribe({
      next: () => {
        this.loading = false;
        this.notify.success('Mot de passe réinitialisé avec succès', 'Succès');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err: any) => {
        this.loading = false;
        this.notify.error(err, 'Erreur');
      },
    });
  }
}
