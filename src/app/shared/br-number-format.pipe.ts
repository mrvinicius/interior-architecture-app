import { Pipe, PipeTransform } from '@angular/core';

import { CurrencyFormatPipe } from './currency-format.pipe';

@Pipe({
  name: 'brNumberFormat'
})
export class BrNumberFormatPipe implements PipeTransform {

  transform(value: number, currencyCode: string = 'BRL', symbolDisplay: boolean = true, digits?: string): string {
    if (!value) {
      return '';
    }

    let currencyPipe = new CurrencyFormatPipe();
    let newValue: string =
      currencyPipe.transform(value, currencyCode, symbolDisplay, digits);

    return newValue.replace('R$', '');
  }

}
