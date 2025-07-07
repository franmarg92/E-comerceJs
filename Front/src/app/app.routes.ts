import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { HomeComponent } from './views/home/home.component';
import { AcountComponent } from './views/acount/acount.component';
import { ShopComponent } from './views/shop/shop.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AboutUsComponent } from './views/about-us/about-us.component';
import { ContactComponent } from './views/contact/contact.component';
import { ProfileComponent } from './views/profile/profile.component';
import { CartComponent } from './views/cart/cart.component';

export const routes: Routes = [
    {path: '', component:HomeComponent},
    {path: 'account', component:AcountComponent},
    {path: 'shop', component:ShopComponent},
    {path: 'about-us', component:AboutUsComponent},
    {path: 'contact', component:ContactComponent},
    {path: 'cart', component:CartComponent},
    {path: 'dashboard', component:DashboardComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'cliente'] },
        children: [
            {path: 'profile', component:ProfileComponent},
           
        ]
    }
];
