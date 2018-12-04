import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderNumber'
})
export class OrderNumberPipe implements PipeTransform {
    transform(value: number): string {
        if (!value) {
            return '';
        }
        return (value.toString() as any).padStart(4, '0');
    }
}
