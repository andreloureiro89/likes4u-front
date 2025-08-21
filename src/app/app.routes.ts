import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { CheckoutCartComponent } from './checkout-cart/checkout-cart.component';

export const routes: Routes = [
  { path: 'checkout-cart', component: CheckoutCartComponent }, 
  { path: '', component: MainPageComponent },
  { path: '**', redirectTo: '' },

];
