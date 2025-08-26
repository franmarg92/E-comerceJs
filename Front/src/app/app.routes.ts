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
import { OrderDetailComponent } from './views/order-detail/order-detail.component';
import { MyPurchasesComponent } from './views/my-purchases/my-purchases.component';
import { SalesComponent } from './views/sales/sales.component';
import { EditProductComponent } from './views/edit-product/edit-product.component';
import { PaidsComponent } from './views/paids/paids.component';
import { NotFoundDistinzioneComponent } from './views/not-found-distinzione/not-found-distinzione.component';

export const routes: Routes = [
  
  { path: '', component: HomeComponent },
  { path: 'account', component: AcountComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'order-detail', component: OrderDetailComponent },
  { path: 'pago-exitoso', component: PaidsComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'cliente'] },
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'product-editor', component: ProductEditorComponent },
      { path: 'my-purchases', component: MyPurchasesComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'edit-product', component: EditProductComponent },
    ],
  },
  { path: '**', component: NotFoundDistinzioneComponent }
];
