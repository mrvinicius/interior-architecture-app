import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'abx-supplier-budget-view',
  template: `
    <abx-supplier-budget [replyId]="budgetReplyId$ | async"></abx-supplier-budget>
  `,
  styles: []
})
export class SupplierBudgetViewComponent implements OnInit {
  budgetReplyId$: Observable<string>;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.budgetReplyId$ = this.activatedRoute.params
      .map(params => params['replyId']);
  }

}
