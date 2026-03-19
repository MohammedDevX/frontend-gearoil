import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './auth/reset-password/reset-password';
import { EditProfileComponent } from './features/edit-profile/UI/edit-profile';
import { Home } from './features/home/home';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  // Default: redirect to login
  { path: '', component: Home },
  { path: 'edit-profile', component: EditProfileComponent },

  // Public routes (no guard)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // Protected routes — requires a valid token in localStorage
  { path: 'home', component: Home, canActivate: [authGuard] },

  // Fallback: anything unknown → login
  { path: '**', redirectTo: '/login' },
];
