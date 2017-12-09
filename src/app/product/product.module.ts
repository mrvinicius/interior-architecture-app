import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ProductRoutingModule } from './product-routing.module';
import { ProductService } from './shared/product.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ProductRoutingModule
  ],
  providers: [ProductService],
  declarations: []
})
export class ProductModule { }
