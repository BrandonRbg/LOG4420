import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShoppingCartItem, ShoppingCartService } from './services/shopping-cart.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

/**
 * Defines the main component of the application.
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

    public shoppingCartCount = 0;

    readonly authors = [
        'Brandon Roberge',
        'Julien Dufresne'
    ];

    private shoppingCartCountSubscription$: Subscription;

    constructor(private shoppingCartService: ShoppingCartService) {
    }

    ngOnInit(): void {
        this.shoppingCartCountSubscription$ = this.shoppingCartService.shoppingCartUpdates$
            .pipe(map((items) => items.reduce((a, b) => a + b.quantity, 0)))
            .subscribe((length) => this.shoppingCartCount = length);
    }

    ngOnDestroy(): void {
        this.shoppingCartCountSubscription$.unsubscribe();
    }
}
