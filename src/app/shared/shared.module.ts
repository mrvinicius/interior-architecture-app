import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TextMaskModule } from 'angular2-text-mask';

import 'materialize-css';
import { MaterializeModule } from 'angular2-materialize';

import { BrNumberFormatPipe } from './br-number-format.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BrNumberFormatPipe],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    BrNumberFormatPipe,
    TextMaskModule,
    MaterializeModule
  ],
  providers: []
})
export class SharedModule { }
