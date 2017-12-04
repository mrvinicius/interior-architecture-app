import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UtilsService } from '../shared/utils/utils.service';

import { BudgetsService } from '../budgets/shared/budgets.service';

import { BudgetRequest } from './shared/budget-request';

@Component({
  selector: 'abx-supplier-budget-sender-container',
  template: `
    <section class="u-row" style="padding-top: 24px;">
      <h1 style="font-size: 3em; margin-bottom: 0">Envie seu orçamento</h1>
      <div class="u-col s5">
        <label for="totalPrice" class="readonly-value-label">total</label>
        <h5 id="totalPrice" style="font-size: 2rem">
          {{totalPrice | currencyFormat:'BRL':true}}
          <ng-container *ngIf="!totalPrice || totalPrice === 0">R$0,00</ng-container>
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
  totalPrice: number = 0;
  private units: number;

  constructor(
    private budgetServ: BudgetsService,
    private fb: FormBuilder
  ) { }

  budgetSubmited(data): void {
    console.log(data)
  }

  priceChanged(stringValue): void {
    let price = UtilsService.parseMonetaryString(stringValue);

    if (this.units !== undefined) {
      price = price * this.units;
    }

    this.totalPrice = price;
  }

  createBudgetForm(budgetRequest, formBuilder, perUnit: boolean = true): FormGroup {
    let formGroupObj = {
      availability: [],
      colors: [],
      productCode: [],
      note: []
    }

    if (perUnit) {
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
        this.units = budgetRequest.measureUnit === 'units' ?
          Number(budgetRequest.quantity) : undefined;

        this.budgetRequestLoad.emit(budgetRequest);
        this.budgetSenderForm = this.createBudgetForm(
          budgetRequest,
          this.fb,
          this.units !== undefined
        );
      });
  }
}
