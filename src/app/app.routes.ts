import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { AppSidebarComponent } from './shared/app-sidebar/app-sidebar.component';

export const routes: Routes = [
  { path: '', component: Home },
  {path: 'sidebar', component: AppSidebarComponent}
];
