import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupplierBudgetViewComponent } from './supplier-budget-view.component';

const routes: Routes = [
  {
    path: 'fornecedor/orcamento/:replyId',
    component: SupplierBudgetViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
