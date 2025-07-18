import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { HomeComponent } from './views/home/home.component';
import { AcountComponent } from './views/acount/acount.component';
import { ShopComponent } from './views/shop/shop.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AboutUsComponent } from './views/about-us/about-us.component';
import { ContactComponent } from './views/contact/contact.component';
import { ProfileComponent } from './views/profile/profile.component';
import { ProductEditorComponent } from './views/product-editor/product-editor.component';
import { ProductDetailComponent } from './views/product-detail/product-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'account', component: AcountComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact', component: ContactComponent },
  {path: 'product-detail/:id', component:ProductDetailComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'cliente'] },
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'product-editor', component: ProductEditorComponent },
    ],
  },
];
