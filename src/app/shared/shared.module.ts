import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';

import { CurrencyFormatPipe } from './currency-format.pipe';
import { BrNumberFormatPipe } from './br-number-format.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CurrencyFormatPipe, BrNumberFormatPipe],
  exports: [
    BrNumberFormatPipe,
    CommonModule,
    CurrencyFormatPipe,
    TextMaskModule
  ],
  providers: []
})
export class SharedModule { }
