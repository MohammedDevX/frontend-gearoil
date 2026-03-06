import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { AppSidebarComponent } from './shared/app-sidebar/app-sidebar.component';
import { ListeUsers } from './features/liste-users/liste-users';

export const routes: Routes = [
  { path: '', component: Home },
  // {path: 'sidebar', component: AppSidebarComponent},
  {path: 'liste-users', component: ListeUsers}
];
