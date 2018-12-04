import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Config } from '../config';

export interface ShoppingCartItem {
    productId: number;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class ShoppingCartService {
    public shoppingCartUpdates$ = new BehaviorSubject<ShoppingCartItem[]>([]);

    constructor(private httpClient: HttpClient) {
        this.init();
    }

    async init() {
        this.shoppingCartUpdates$.next(await this.getAll());
    }

    getAll(): Promise<ShoppingCartItem[]> {
        return this.httpClient.get<ShoppingCartItem[]>(`${Config.apiUrl}/shopping-cart`, {
            withCredentials: true
        }).toPromise();
    }

    async addItem(item: ShoppingCartItem): Promise<void> {
        await this.httpClient.post<void>(`${Config.apiUrl}/shopping-cart`, item, {
            withCredentials: true
        }).toPromise();
        this.shoppingCartUpdates$.next(await this.getAll());
    }

    async updateItem(item: ShoppingCartItem): Promise<void> {
        await this.httpClient.put<void>(`${Config.apiUrl}/shopping-cart/${item.productId}`, {
            quantity: item.quantity
        }, {
            withCredentials: true
        }).toPromise();
        this.shoppingCartUpdates$.next(await this.getAll());
    }

    async removeItem(item: ShoppingCartItem) {
        await this.httpClient.delete(`${Config.apiUrl}/shopping-cart/${item.productId}`, {
            withCredentials: true
        }).toPromise();
        this.shoppingCartUpdates$.next(await this.getAll());
    }

    async removeAll() {
        await this.httpClient.delete(`${Config.apiUrl}/shopping-cart`, {
            withCredentials: true
        }).toPromise();
        this.shoppingCartUpdates$.next(await this.getAll());
    }
}
