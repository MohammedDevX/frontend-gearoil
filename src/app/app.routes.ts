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
import { ProductDetail } from './features/products/product-detail/product-detail';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductFormComponent } from './features/products/product-form/product-form.component';
import { roleGuard } from './core/guards/role.guard';
import { CheckoutComponent } from './features/checkout/checkout';
import { TrackingComponent } from './features/tracking/tracking';
import { LivreurLayoutComponent } from './layouts/livreur-layout/livreur-layout';
import { LivreurDashboardComponent } from './features/livreur-dashboard/livreur-dashboard';

export const routes: Routes = [
  { path: 'liste-users', redirectTo: 'admin/liste-users', pathMatch: 'full' },
  {
    path: 'suppliers',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['Admin'] },
    children: [
      { path: '', component: SuppliersComponent }
    ]
  },
  // Admin Routes (Dashboard)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['Admin'] },
    children: [
      { path: 'suppliers', component: SuppliersComponent },
      { path: 'liste-users', component: ListeUsers },
      { path: 'activate-admin', component: ActivateAdminComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'products/add', component: ProductFormComponent },
      { path: 'products/:id/edit', component: ProductFormComponent },
      { path: '', redirectTo: 'liste-users', pathMatch: 'full' }
    ]
  },
  
  // Livreur Routes
  {
    path: 'livreur',
    component: LivreurLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['Livreur'] },
    children: [
      { path: 'dashboard', component: LivreurDashboardComponent },
      { path: 'active', component: TrackingComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Client Routes
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      { path: '', component: Home, pathMatch: 'full', data: { isPublic: true } },
      { path: 'home', component: Home, data: { isPublic: true } },
      { path: 'login', component: LoginComponent, data: { isPublic: true } },
      { path: 'register', component: RegisterComponent, data: { isPublic: true } },
      { path: 'forgot-password', component: ForgotPasswordComponent, data: { isPublic: true } },
      { path: 'reset-password', component: ResetPasswordComponent, data: { isPublic: true } },
      { path: 'edit-profile', component: EditProfileComponent, canActivate: [authGuard, roleGuard], data: { expectedRoles: ['Client'] } },
      { path: 'cart', component: CartComponent, canActivate: [authGuard, roleGuard], data: { expectedRoles: ['Client'] } },

      // Placeholder routes to prevent redirection for missing pages
      { path: 'wishlist', component: Home, data: { isPublic: true } },
      { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard, roleGuard], data: { expectedRoles: ['Client'] } },
      { path: 'track-order/:id', component: TrackingComponent, canActivate: [authGuard, roleGuard], data: { expectedRoles: ['Client', 'Livreur'] } },
      { path: 'about-us', component: Home, data: { isPublic: true } },
      { path: 'contact-us', component: Home, data: { isPublic: true } },
      { path: 'track-order', component: Home, data: { isPublic: true } },
      { path: 'compare', component: Home, data: { isPublic: true } },
      { path: 'shop', component: Home, data: { isPublic: true } },
      { path: 'products', component: ProductDetail, data: { isPublic: true } }
    ]
  },

  // Fallback: anything unknown → login
  { path: '**', redirectTo: '/login' },
];
