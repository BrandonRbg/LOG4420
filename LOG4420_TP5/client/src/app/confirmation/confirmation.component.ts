import { Component, OnDestroy, OnInit } from '@angular/core';
import { Order, OrderService } from '../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

/**
* Defines the component responsible to manage the confirmation page.
*/
@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent implements OnInit, OnDestroy {
    public order: Order;

    private qParamsSub: Subscription;

    constructor(private orderService: OrderService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.qParamsSub = this.route.queryParams.subscribe(async x => {
            this.order = await this.orderService.get(+x['orderId']);
        });
    }

    ngOnDestroy() {
        this.qParamsSub.unsubscribe();
    }
}
