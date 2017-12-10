import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatChipsModule, MatStepperModule, MatDialogModule, MatExpansionModule, MatTableModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from '../shared/shared.module';

import { BudgetRequestComponent } from './budget-request/budget-request.component';
import { BudgetRequesterComponent } from './budget-requester/budget-requester.component';
import { BudgetsComponent, RequestConfirmationComponent } from './budgets.component';
import { BudgetsRoutingModule } from './budgets-routing.module';
import { BudgetsService } from './shared/budgets.service';
import { ReplyService } from './shared/reply.service';
import { LayoutModule } from '../layout/layout.module';
import { ProductModule } from './../product/product.module';
import { SupplierModule } from '../supplier/supplier.module';

@NgModule({
  imports: [
    SharedModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatStepperModule,
    MatDialogModule,
    MatExpansionModule,
    MatTableModule,
    HttpClientModule,
    LayoutModule,
    ProductModule,
    BudgetsRoutingModule
  ],
  declarations: [
    BudgetsComponent,
    BudgetRequesterComponent,
    BudgetRequestComponent,
    RequestConfirmationComponent
  ],
  providers: [
    BudgetsService,
    ReplyService
  ],
  entryComponents: [RequestConfirmationComponent]
})
export class BudgetsModule { }
