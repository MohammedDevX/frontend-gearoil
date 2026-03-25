import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './auth/reset-password/reset-password';
import { EditProfileComponent } from './features/edit-profile/UI/edit-profile';
import { Home } from './features/home/home';
import { ListeUsers } from './features/liste-users/liste-users';
import { ActivateAdminComponent } from './test/test';
import { SuppliersComponent } from './features/suppliers/suppliers';
import { authGuard } from './auth/auth.guard';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';
import { CartComponent } from './features/cart/cart';

export const routes: Routes = [
  { path: 'liste-users', redirectTo: 'admin/liste-users', pathMatch: 'full' },
  { path: 'activate-admin', component: ActivateAdminComponent },

  // Admin Routes (Dashboard)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'liste-users', component: ListeUsers },
      { path: 'suppliers', component: SuppliersComponent },
      { path: '', redirectTo: 'liste-users', pathMatch: 'full' }
    ]
  },

  // Client Routes
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      { path: '', component: Home, pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'edit-profile', component: EditProfileComponent, canActivate: [authGuard] },
      { path: 'cart', component: CartComponent},

      // Placeholder routes to prevent redirection for missing pages
      { path: 'wishlist', component: Home },
      { path: 'cart', component: Home },
      { path: 'checkout', component: Home },
      { path: 'about-us', component: Home },
      { path: 'contact-us', component: Home },
      { path: 'track-order', component: Home },
      { path: 'compare', component: Home },
      { path: 'shop', component: Home },
    ]
  },

  // Fallback: anything unknown → login
  { path: '**', redirectTo: '/login' },
];
