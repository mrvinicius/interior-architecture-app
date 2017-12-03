import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BudgetsService } from '../budgets/shared/budgets.service';

import { BudgetRequest } from './shared/budget-request';

@Component({
  selector: 'abx-supplier-budget-sender-container',
  template: `
    <section class="u-row" style="padding-top: 24px;">
      <h1 style="font-size: 3em;">Envie seu orçamento</h1>
      <div class="u-col s5">
        <label for="totalPrice" class="readonly-value-label">total</label>
        <h5 *ngIf="totalPrice && totalPrice !== 0" id="totalPrice" style="font-size: 2rem">
          {{totalPrice | currencyFormat:'BRL':true}}
        </h5>
      </div>
      <div class="col s7">
        <abx-supplier-budget-sender
        [senderFormGroup]="budgetSenderForm"
        (budgetSubmit)="budgetSubmited($event)"
        (priceChange)="priceChanged($event)">
        </abx-supplier-budget-sender>
      </div>
    </section>
  `,
})
export class SupplierBudgetSenderContainerComponent implements OnInit {
  @Input()
  replyId: string;
  @Output()
  budgetRequestLoad = new EventEmitter<BudgetRequest>();
  budgetSenderForm: FormGroup;
  totalPrice: number = 1.99;

  constructor(
    private budgetServ: BudgetsService,
    private fb: FormBuilder
  ) {
  }

  budgetSubmited(data): void {

  }

  priceChanged(stringValue): void {
    console.log(stringValue)
  }

  createSenderForm(budgetRequest: BudgetRequest, formBuilder): FormGroup {
    let formGroupObj = {
      availability: [],
      colors: [],
      productCode: [],
      note: []
    }

    if (budgetRequest.measureUnit === 'units') {
      formGroupObj['unitPrice'] = [, [
        Validators.required
      ]];
    } else {
      formGroupObj['totalPrice'] = [, [
        Validators.required
      ]];
    }

    return formBuilder.group(formGroupObj);
  }

  ngOnInit() {
    this.budgetServ
      .getByReply(this.replyId)
      .subscribe(budgetRequest => {
        this.budgetRequestLoad.emit(budgetRequest);
        this.budgetSenderForm = this.createSenderForm(budgetRequest, this.fb);
      });
  }
}
