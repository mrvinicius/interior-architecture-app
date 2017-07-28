import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';

import { CurrencyFormatPipe } from './currency-format.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CurrencyFormatPipe],
  exports: [
    CommonModule,
    CurrencyFormatPipe,
    TextMaskModule
  ],
  providers: []
})
export class SharedModule { }
