import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShoppingCartItem, ShoppingCartService } from '../services/shopping-cart.service';
import { Product, ProductsService } from '../services/products.service';

/**
 * Defines the component responsible to manage the shopping cart page.
 */
@Component({
    selector: 'shopping-cart',
    templateUrl: './shopping-cart.component.html'
})
export class ShoppingCartComponent implements OnInit {

    public productItems: (Product & ShoppingCartItem)[] = [];
    public products: Product[] = [];

    constructor(
        private productsService: ProductsService,
        private shoppingCartService: ShoppingCartService) {
    }

    async ngOnInit() {
        this.products = await this.productsService.getProducts();
        this.shoppingCartService.shoppingCartUpdates$.subscribe((items) => {
            this.productItems = this.combineProductsWithItems(items);
        });
    }

    private getProductById(id: number): Product {
        return this.products.find(p => p.id === id);
    }

    get sortedProductItems(): (Product & ShoppingCartItem)[] {
        return this.productItems.sort((a, b) => {
            const aname = a.name.toLowerCase();
            const bname = b.name.toLowerCase();
            if (aname < bname) {
                return -1;
            } else if (aname > bname) {
                return 1;
            }
            return 0;
        });
    }

    combineProductsWithItems(items: ShoppingCartItem[]): (Product & ShoppingCartItem)[] {
        return items.map((i) => {
            const product = this.getProductById(i.productId);
            return {
                ...i,
                ...product
            };
        });
    }

    getProductLink(product: Product): string {
        return `/produits/${product.id}`;
    }

    getTotalCostForProduct(product: (Product & ShoppingCartItem)) {
        return product.price * product.quantity;
    }

    get totalCost() {
        return this.productItems.reduce((acc, i) => {
            return acc + i.quantity * i.price;
        }, 0);
    }

    async clickChangeQuantity(item: ShoppingCartItem, delta: number) {
        item.quantity += delta;
        await this.shoppingCartService.updateItem(item);
    }

    async clickRemove(item: ShoppingCartItem) {
        if (confirm('Voulez vous supprimer le produit du panier?')) {
            await this.shoppingCartService.removeItem(item);
        }
    }

    async clickEmptyCart() {
        if (confirm('Voulez vous supprimer tous les produits du panier?')) {
            await this.shoppingCartService.removeAll();
        }
    }
}
