import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { SupplierCreatorComponent } from './supplier-creator/supplier-creator.component';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierService } from './shared/supplier.service';
import { SupplierStoreCreatorComponent } from './supplier-store-creator/supplier-store-creator.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,

    // Routing Module
    SupplierRoutingModule
  ],
  providers: [SupplierService],
  declarations: [SupplierCreatorComponent, SupplierStoreCreatorComponent]
})
export class SupplierModule { }
