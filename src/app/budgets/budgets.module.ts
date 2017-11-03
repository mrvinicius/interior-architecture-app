import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetRequesterComponent } from './budget-requester/budget-requester.component';
import { BudgetsComponent } from './budgets.component';
import { BudgetsRoutingModule } from './budgets-routing.module';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    BudgetsRoutingModule
  ],
  declarations: [
    BudgetsComponent,
    BudgetRequesterComponent
  ]
})
export class BudgetsModule { }
