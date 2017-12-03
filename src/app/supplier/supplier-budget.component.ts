import { Component, OnInit, Input } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { BudgetRequest } from './shared/budget-request';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'abx-supplier-budget',
  template: `
    <style>
      p {
        font-size: 1.1rem;
      }

      :host {
        display: block;
        overflow: auto;
        width: 100%;
        height: 100%;
        background-color: antiquewhite;
      }
    </style>
    <main class="card-panel card-page white">
      <section>
        <h1 style="font-size: 3em; margin-bottom: 0;">Solicitação de orçamento</h1>
        <abx-budget-request-notification [budgetRequest]="budgetRequest$ | async"></abx-budget-request-notification>
      </section>
      <div class="divider"></div>
      <abx-supplier-budget-sender-container (budgetRequestLoad)="budgetRequestLoaded($event)" [replyId]="replyId"></abx-supplier-budget-sender-container>
    </main>
  `,
  styles: []
})
export class SupplierBudgetComponent implements OnInit {
  @Input()
  replyId: string;

  // budgetRequest: BudgetRequest;
  budgetRequest$: Observable<BudgetRequest>;
  _budgetRequest: BehaviorSubject<BudgetRequest> = new BehaviorSubject(undefined);
  constructor() { }

  budgetRequestLoaded(budgetRequest: BudgetRequest) {
    // this.budgetRequest = budgetRequest;
    this._budgetRequest.next(budgetRequest)
  }

  ngOnInit() {
    this.budgetRequest$ = this._budgetRequest.asObservable();
  }

}
