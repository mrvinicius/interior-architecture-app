import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductService } from './shared/product.service';

@NgModule({
  imports: [
    CommonModule,
    ProductRoutingModule
  ],
  providers: [ProductService],
  declarations: []
})
export class ProductModule { }
