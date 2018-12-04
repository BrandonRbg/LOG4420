import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Order, OrderService } from '../services/order.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Router } from '@angular/router';

declare const $: any;

/**
 * Defines the component responsible to manage the order page.
 */
@Component({
    selector: 'order',
    templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit, AfterViewInit {
    orderForm: any;
    order: Order = {} as Order;

    constructor(private orderService: OrderService, private shoppingCartService: ShoppingCartService, private router: Router) {}

    /**
     * Occurs when the component is initialized.
     */
    async ngOnInit() {
        const items = await this.shoppingCartService.getAll();
        this.order = {
            products: items.map(x => {
                return {
                    id: x.productId,
                    quantity: x.quantity
                };
            })
        } as Order;
    }

    ngAfterViewInit() {
        // Initializes the validation of the form. This is the ONLY place where jQuery usage is allowed.
        this.orderForm = $('#order-form');
        $.validator.addMethod('ccexp', function (value) {
            if (!value) {
                return false;
            }
            const regEx = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[1-9][0-9])$/g;
            return regEx.test(value);
        }, 'La date d\'expiration de votre carte de crédit est invalide.');
        this.orderForm.validate({
            rules: {
                'phone': {
                    required: true,
                    phoneUS: true
                },
                'credit-card': {
                    required: true,
                    creditcard: true
                },
                'credit-card-expiry': {
                    ccexp: true
                }
            }
        });
    }

    /**
     * Submits the order form.
     */
    async submit() {
        if (!this.orderForm.valid()) {
            return;
        }
        try {
            this.order.id = await this.orderService.getNextId();
            await this.orderService.create(this.order);
            await this.shoppingCartService.removeAll();
            await this.router.navigate(['/confirmation'], {
                queryParams: {
                    orderId: this.order.id
                }
            });
        } catch (e) {
            console.log(e);
        }
    }
}
