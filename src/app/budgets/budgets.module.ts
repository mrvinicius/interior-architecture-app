import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatStepperModule, MatDialogModule, MatExpansionModule, MatTableModule } from '@angular/material';
// TODO: Move to SharedModule
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterializeModule } from 'angular2-materialize';

import { BudgetRequestComponent } from './budget-request/budget-request.component';
import { BudgetRequesterComponent } from './budget-requester/budget-requester.component';
import { BudgetRequestListComponent } from './budget-request-list/budget-request-list.component';
import { BudgetsComponent, RequestConfirmationComponent } from './budgets.component';
import { BudgetsRoutingModule } from './budgets-routing.module';
import { BudgetsService } from './shared/budgets.service';
import { LayoutModule } from '../layout/layout.module';
import { ProductModule } from './../product/product.module';
import { SupplierModule } from '../supplier/supplier.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatDialogModule,
    MatExpansionModule,
    MatTableModule,
    MaterializeModule,
    LayoutModule,
    ProductModule,
    BudgetsRoutingModule
  ],
  declarations: [
    BudgetsComponent,
    BudgetRequesterComponent,
    BudgetRequestComponent,
    BudgetRequestListComponent,
    RequestConfirmationComponent
  ],
  providers: [
    BudgetsService
  ],
  entryComponents: [RequestConfirmationComponent]
})
export class BudgetsModule { }
