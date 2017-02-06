import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BudgetsComponent } from './budgets.component';

export const budgetRoutes: Routes = [
  { path: 'orcamentos', component: BudgetsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(budgetRoutes)],
  exports: [RouterModule],
})
export class BudgetsRoutingModule { }

export const routedComponents = [BudgetsComponent];
