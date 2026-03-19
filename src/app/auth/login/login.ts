import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, GoogleSigninButtonModule } from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, GoogleSigninButtonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    @Inject(AuthService) private authService: AuthService,
    private notify: NotificationService,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    console.log('[LoginComponent] Initializing authState...');
    this.socialAuthService.authState.subscribe({
      next: (socialUser: any) => {
        if (socialUser) {
          console.log('[LoginComponent] Social User detected:', socialUser);

          if (socialUser.provider === 'GOOGLE') {
            this.authService.googleLogin(socialUser.idToken).subscribe({
              next: (res: any) => this.handleSuccess(res),
              error: (err: any) => this.notify.error(err, 'Google Fail')
            });
          } else if (socialUser.provider === 'FACEBOOK') {
            this.authService.facebookLogin(socialUser.authToken).subscribe({
              next: (res: any) => this.handleSuccess(res),
              error: (err: any) => this.notify.error(err, 'Facebook Fail')
            });
          }
        }
      },
      error: (err) => console.error('[LoginComponent] authState subscription unit error:', err)
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => this.handleSuccess(res),
      error: (err: any) => {
        console.error('[LoginComponent] Login Error:', err);
        this.notify.error(err);
      }
    });
  }

  // Google is handled by <asl-google-signin-button> in HTML
  loginWithFacebook() {
    console.log('[LoginComponent] Attempting Facebook Login...');
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then(user => {
        console.log('[LoginComponent] Facebook Sign-In Success:', user);
        alert('Facebook Sign-In Success!');
      })
      .catch(err => {
        console.error('[LoginComponent] Facebook Sign-In Error:', err);
        this.notify.error(err, 'Facebook Fail');
      });
  }

  private handleSuccess(response: any) {
    const token = localStorage.getItem('auth_token');
    console.log('[LoginComponent] handleSuccess called. Token in localStorage:', token ? '✅ EXISTS' : '❌ MISSING');
    this.notify.success('You are now logged in.');
    this.router.navigate(['/home']);
  }
}
