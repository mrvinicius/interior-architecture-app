import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetsRoutingModule } from './budgets-routing.module';

import { BudgetsComponent } from './budgets.component';

@NgModule({
  imports: [
    BudgetsRoutingModule
  ],
  declarations: [BudgetsComponent]
})
export class BudgetsModule { }
