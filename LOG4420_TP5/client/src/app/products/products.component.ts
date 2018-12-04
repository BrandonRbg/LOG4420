import { Component, OnInit } from '@angular/core';
import { Product, ProductCategory, ProductsService, SortingCriteria } from '../services/products.service';

/**
 * Defines the component responsible to manage the display of the products page.
 */
@Component({
    selector: 'products',
    templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
    public categories = [
        { id: 'cameras', name: 'Appareils photo' },
        { id: 'consoles', name: 'Consoles' },
        { id: 'screens', name: 'Écrans' },
        { id: 'computers', name: 'Ordinateurs' },
        { id: null, name: 'Tous les produits' }
    ];

    public sortingCriterias = [
        { id: 'price-asc', name: 'Prix (bas-haut)' },
        { id: 'price-dsc', name: 'Prix (haut-bas)' },
        { id: 'alpha-asc', name: 'Nom (A-Z)' },
        { id: 'alpha-dsc', name: 'Nom (Z-A)' }
    ];

    public products: Product[] = [];

    private sortingCriteria: SortingCriteria = 'price-asc';
    private productCategory: ProductCategory = null;

    constructor(private productsService: ProductsService) {
    }

    ngOnInit() {
        this.reload();
    }

    async reload() {
        this.products = await this.productsService.getProducts(this.sortingCriteria, this.productCategory);
    }

    getProductLink(product: Product): string {
        return `/produits/${product.id}`;
    }

    getProductImageUrl(product: Product): string {
        return `./assets/img/${product.image}`;
    }

    isCategorySelected(category: ProductCategory): boolean {
        return this.productCategory === category;
    }

    selectCategory(category: ProductCategory) {
        this.productCategory = category;
        this.reload();
    }

    isCriteriaSelected(criteria: SortingCriteria): boolean {
        return this.sortingCriteria === criteria;
    }

    selectCriteria(criteria: SortingCriteria) {
        this.sortingCriteria = criteria;
        this.reload();
    }
}
