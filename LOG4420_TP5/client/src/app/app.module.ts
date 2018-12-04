import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './product/product.component';
import { ContactComponent } from './contact/contact.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { OrderComponent } from './order/order.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductsService } from './services/products.service';

import localeFr from '@angular/common/locales/fr-CA';
import { registerLocaleData } from '@angular/common';
import { FrenchNumberPipe } from './pipes/french-number.pipe';

registerLocaleData(localeFr);

// Application routes
const appRoutes: Routes = [
    { path: '', redirectTo: '/accueil', pathMatch: 'full' },
    { path: 'accueil', component: HomeComponent },
    { path: 'produits', component: ProductsComponent },
    { path: 'produits/:id', component: ProductComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'panier', component: ShoppingCartComponent },
    { path: 'commande', component: OrderComponent },
    { path: 'confirmation', component: ConfirmationComponent },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ProductsComponent,
        ProductComponent,
        ContactComponent,
        ShoppingCartComponent,
        OrderComponent,
        ConfirmationComponent,
        PageNotFoundComponent,
        FrenchNumberPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: false }
        )
    ],
    providers: [
        ProductsService,
        { provide: LOCALE_ID, useValue: 'fr-CA' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
