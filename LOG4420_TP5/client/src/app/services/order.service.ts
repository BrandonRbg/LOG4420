import { ShoppingCartItem } from './shopping-cart.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../config';
import { map } from 'rxjs/operators';

/**
 * Defines a order.
 */
export interface Order {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    products: { id: number, quantity: number }[];
    creditCard: string;
    expirationDate: string;
}


@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private http: HttpClient) {}

    create(order: Order): Promise<void> {
        return this.http.post<void>(`${Config.apiUrl}/orders`, order).toPromise();
    }

    getNextId(): Promise<number> {
        return this.http.get<Order[]>(`${Config.apiUrl}/orders`).pipe(
            map(x => x.length + 1)
        ).toPromise();
    }

    get(id: number): Promise<Order> {
        return this.http.get<Order>(`${Config.apiUrl}/orders/${id}`).toPromise();
    }
}
