import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NotificationService } from '../../core/services/notification.service';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('Password');
  const confirmPassword = control.get('ConfirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value && confirmPassword.value !== '') {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    @Inject(AuthService) private authService: AuthService,
    private notify: NotificationService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      UserName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/)]],
      ConfirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) return;

    const formValue = this.registerForm.value;

    // Adapter les noms envoyés au backend (.NET)
    const payload = {
      Nom: formValue.FirstName,
      Prenom: formValue.LastName,
      User_name: formValue.UserName,
      Email: formValue.Email,
      Mot_passe: formValue.Password,
      Confirm_pass: formValue.ConfirmPassword,
    };

    this.authService.register(payload as any).subscribe({
      next: (response: any) => {
        this.notify.success('Account created successfully!');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.notify.error(err);
      }
    });
  }
}
