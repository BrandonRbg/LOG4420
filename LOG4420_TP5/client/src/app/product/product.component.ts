import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductsService } from '../services/products.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

/**
 * Defines the component responsible to manage the product page.
 */
@Component({
    selector: 'product',
    templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit, OnDestroy {

    public product: Product;
    public addToCartQuantity = 1;
    public isItemInShoppingCart = false;

    private shoppingCartSubscription$: Subscription;

    constructor(private route: ActivatedRoute,
                private productsService: ProductsService,
                private shoppingCartService: ShoppingCartService) {
    }

    /**
     * Occurs when the component is initialized.
     */
    async ngOnInit() {
        const productId = this.route.snapshot.paramMap.get('id');
        this.shoppingCartSubscription$ = this.shoppingCartService.shoppingCartUpdates$.pipe(
            map((items) => items.find(i => i.productId === +productId) !== null)
        ).subscribe(contains => {
            this.isItemInShoppingCart = contains;
        });
        this.product = await this.productsService.getProduct(+productId);
    }

    ngOnDestroy(): void {
        this.shoppingCartSubscription$.unsubscribe();
    }

    get imageUrl() {
        if (!this.product) {
            return '';
        }
        return `./assets/img/${this.product.image}`;
    }

    addToCart() {
        if (this.isItemInShoppingCart) {
            this.shoppingCartService.updateItem({
                productId: this.product.id,
                quantity: this.addToCartQuantity
            });
        } else {
            this.shoppingCartService.addItem({
                productId: this.product.id,
                quantity: this.addToCartQuantity
            });
        }
    }
}
