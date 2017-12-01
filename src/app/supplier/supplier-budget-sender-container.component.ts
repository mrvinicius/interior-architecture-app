import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { BudgetsService } from '../budgets/shared/budgets.service';

import { BudgetRequest } from './shared/budget-request';

@Component({
  selector: 'abx-supplier-budget-sender-container',
  template: `
    <abx-supplier-budget-sender></abx-supplier-budget-sender>
  `,
  styles: []
})
export class SupplierBudgetSenderContainerComponent implements OnInit {
  @Input()
  replyId: string;

  @Output()
  budgetRequestLoad = new EventEmitter<BudgetRequest>();

  constructor(private budgetServ: BudgetsService) { }

  ngOnInit() {
    this.budgetServ
      .getByReply(this.replyId)
      .subscribe(budgetRequest => this.budgetRequestLoad.emit(budgetRequest));
  }

}
