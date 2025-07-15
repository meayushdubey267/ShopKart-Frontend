import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AuthGuard,AuthModule,AuthHttpInterceptor } from '@auth0/auth0-angular';
import { ProductListComponent } from './components/product-list/product-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ProductService } from './services/product.service';
import {Routes,RouterModule } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';

import myAppConfig from './config/my-app-config';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { HelpComponent } from './components/help/help.component';
import { ErrorComponent } from './components/error/error.component';
import { ContactComponent } from './components/contact/contact.component';

const routes: Routes=[
  {path:'order-history',component:OrderHistoryComponent,canActivate:[AuthGuard]},
  {path:'members',component:MembersPageComponent,canActivate:[AuthGuard]},
  {path:'cart-details',component:CartDetailsComponent,canActivate:[AuthGuard]},
  {path:'search/:keyword',component:ProductListComponent},
  {path:'products/:id',component:ProductDetailsComponent},
  {path:'checkout',component:CheckoutComponent,canActivate:[AuthGuard]},
  {path:'category/:id',component:ProductListComponent},
  {path:'category',component:ProductListComponent},
  {path:'products',component:ProductListComponent},
  {path:'error',component:ErrorComponent},
  {path:'about-us',component:AboutUsComponent},
  { path: 'contact', component: ContactComponent },
  {path:'help',component:HelpComponent},
  {path:'',redirectTo:'/products',pathMatch:'full'}
  // {path:'**',redirectTo:'/error',pathMatch:'full'},
]; 
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent,
    AboutUsComponent,
    ContactComponent,
    HelpComponent,
    ErrorComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    AuthModule.forRoot({
      ...myAppConfig.auth,
      httpInterceptor: {
        ...myAppConfig.httpInterceptor,
      },
    })
  ],
  providers: [ProductService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService,multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }