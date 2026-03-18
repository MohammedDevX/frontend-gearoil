import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { EditProfileComponent } from './features/edit-profile/UI/edit-profile';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'edit-profile', component: EditProfileComponent }
];
