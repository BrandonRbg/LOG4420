import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'frenchNumber'
})
export class FrenchNumberPipe implements PipeTransform {
    transform(value: number): string {
        if (!value) {
            return '';
        }
        return value.toLocaleString('fr-CA', {
            useGrouping: false
        });
    }
}
