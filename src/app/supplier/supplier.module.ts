import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierService } from './shared/supplier.service';
import { SupplierBudgetViewComponent } from './supplier-budget-view.component';
import { SupplierBudgetComponent } from './supplier-budget.component';
import { SupplierBudgetSenderComponent } from './supplier-budget-sender/supplier-budget-sender.component';
import { BudgetRequestNotificationComponent } from './budget-request-notification.component';
import { SupplierBudgetSenderContainerComponent } from './supplier-budget-sender-container.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    // Routing Module
    SupplierRoutingModule
  ],
  providers: [SupplierService],
  declarations: [
    SupplierBudgetSenderComponent,
    BudgetRequestNotificationComponent,
    SupplierBudgetSenderContainerComponent,
    SupplierBudgetViewComponent,
    SupplierBudgetComponent
  ]
})
export class SupplierModule { }
