import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './auth/reset-password/reset-password';
import { EditProfileComponent } from './features/edit-profile/UI/edit-profile';
import { Home } from './features/home/home';
import { AppSidebarComponent } from './shared/app-sidebar/app-sidebar.component';
import { ListeUsers } from './features/liste-users/liste-users';
import { ActivateAdminComponent } from './test/test';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  // {path: 'sidebar', component: AppSidebarComponent},
  {path: 'liste-users', component: ListeUsers},
  {path: 'activate-admin', component: ActivateAdminComponent},
  
  { path: 'edit-profile', component: EditProfileComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'home', component: Home, canActivate: [authGuard] },

  // Protected routes — requires a valid token in localStorage

  // Fallback: anything unknown → login
  { path: '**', redirectTo: '/login' },
];
