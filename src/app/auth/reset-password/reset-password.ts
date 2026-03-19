import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
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

  checkingToken = true;
  validToken = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    @Inject(AuthService) private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
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
      let rawToken = params.get('token') ?? '';
      this.token = rawToken.replace(/ /g, '+');

      if (!this.email || !this.token) {
        this.checkingToken = false;
        this.validToken = false;
        this.toastr.error('Lien de réinitialisation invalide ou expiré.', 'Erreur');
        return;
      }

      // Backend verify-reset-token is commented out and not in Ocelot.
      // We assume the token is valid, and handle errors upon submission.
      this.checkingToken = false;
      this.validToken = true;
    });
  }

  // private verifyToken(): void {
  //   this.checkingToken = true;
  //   this.authService.verifyResetToken(this.email, this.token).subscribe({
  //     next: (isValid: boolean) => {
  //       this.checkingToken = false;
  //       if (isValid) {
  //         this.validToken = true;
  //       } else {
  //         this.validToken = false;
  //         this.toastr.error('Ce lien de réinitialisation est expiré ou invalide', 'Erreur');
  //       }
  //       this.cdr.detectChanges();
  //     },
  //     error: (err: any) => {
  //       this.checkingToken = false;
  //       this.validToken = false;
  //       this.toastr.error('Impossible de vérifier le lien de réinitialisation.', 'Erreur');
  //       this.cdr.detectChanges();
  //     }
  //   });
  // }

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
    if (this.resetForm.invalid || !this.validToken) {
      return;
    }

    this.loading = true;
    const payload: ResetPasswordDTO = {
      email: this.email,
      token: this.token,
      newPassword: this.resetForm.get('newPassword')?.value,
    };

    // DEBUG — à supprimer après debug
    console.log('📤 Payload envoyé:', JSON.stringify(payload, null, 2));

    this.authService.resetPassword(payload).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Mot de passe réinitialisé avec succès', 'Succès');
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err: Error) => {
        this.loading = false;
        this.toastr.error(err.message ?? 'Impossible de réinitialiser le mot de passe.', 'Erreur');
        this.cdr.detectChanges();
      },
    });
  }
}
