import { Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { MainPageComponent } from './main-page/main-page.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },     // homepage
  // (opcional) { path: 'menu', component: MenuComponent },
  { path: '**', redirectTo: '' }                  // wildcard
];
