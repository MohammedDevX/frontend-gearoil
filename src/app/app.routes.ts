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
import { CheckoutComponent } from './features/checkout/checkout';
import { ProductDetail } from './features/products/product-detail/product-detail';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductFormComponent } from './features/products/product-form/product-form.component';

export const routes: Routes = [
  { path: 'liste-users', redirectTo: 'admin/liste-users', pathMatch: 'full' },
  {
    path: 'suppliers',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: SuppliersComponent }
    ]
  },
        { path: 'products', component: ProductListComponent },
      { path: 'products/add', component: ProductFormComponent },
      { path: 'products/:id/edit', component: ProductFormComponent },
  // Admin Routes (Dashboard)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    // canActivate: [authGuard],
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

  // Client Routes
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      { path: '', component: Home, pathMatch: 'full' },
      { path: 'home', component: Home, canActivate: [authGuard] },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'edit-profile', component: EditProfileComponent, canActivate: [authGuard] },
      { path: 'cart', component: CartComponent},

      // Placeholder routes to prevent redirection for missing pages
      { path: 'wishlist', component: Home },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'about-us', component: Home },
      { path: 'contact-us', component: Home },
      { path: 'track-order', component: Home },
      { path: 'compare', component: Home },
      { path: 'shop', component: Home },
      {path: 'detail/:id', component: ProductDetail}
    ]
  },

  // Fallback: anything unknown → login
  { path: '**', redirectTo: '/login' },
];
