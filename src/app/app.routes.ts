import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register';
import { SetPasswordComponent } from './pages/set-password/set-password';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'set-password', component: SetPasswordComponent }
];