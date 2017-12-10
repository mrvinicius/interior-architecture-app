import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UtilsService } from '../shared/utils/utils.service';

import { BudgetsService } from '../budgets/shared/budgets.service';

import { BudgetReply } from './shared/budget-reply';
import { BudgetRequest } from './shared/budget-request';
import { ReplyService } from '../budgets/shared/reply.service';

@Component({
  selector: 'abx-supplier-budget-sender-container',
  template: `
    <section *ngIf="!replySent" class="u-row" style="padding-top: 24px;">
      <h1 *ngIf="reply" style="font-size: 3em; margin-bottom: 0">
        <ng-container *ngIf="reply.status === 'Waiting'">Envie seu orçamento</ng-container>
        <ng-container *ngIf="reply.status === 'Budgeted'">Produto já foi orçado</ng-container>
      </h1>
      <div class="u-col s5">
        <div *ngIf="reply && reply.status !== 'Budgeted'">
          <label for="totalPrice" class="readonly-value-label">total</label>
          <h5 id="totalPrice" style="font-size: 2rem">
            {{totalPrice | currency:'BRL':'symbol'}}
          </h5>
        </div>
        <ng-container *ngIf="reply && reply.status === 'Budgeted'">
          <div>
            <label for="000" class="readonly-value-label">preço total</label>
            <h5 id="000" style="font-size: 2rem">
              {{reply.totalPrice | currency:'BRL':'symbol'}}
            </h5>
            <p id="000"></p>
          </div>
          <!--
          <div *ngIf="budgetRequest.product.productCode">
            <label for="000" class="readonly-value-label">código do produto</label>
            <p id="000">{{budgetRequest.product.productCode}}</p>
          </div>
          -->
          <div *ngIf="reply.color">
            <label for="000" class="readonly-value-label">cores disponíveis</label>
            <p id="000">
              {{reply.color}}
              <!--
              <ng-container *ngFor="let c of reply.colors; let i = index;">
                {{c}}<ng-container *ngIf="(i+1) < reply.colors.length">, </ng-container>
              </ng-container>
              -->
            </p>
          </div>
          <div *ngIf="reply.note && reply.note.length">
            <label for="000" class="readonly-value-label">informações adicionais</label>
            <p id="000">{{reply.note}}</p>
          </div>
        </ng-container>
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
  replySent: boolean = false;
  budgetRequest: BudgetRequest;
  reply: BudgetReply;
  totalPrice: number = 0;
  private units: number;

  constructor(
    private budgetServ: BudgetsService,
    private fb: FormBuilder,
    private replyServ: ReplyService
  ) { }

  budgetSubmited(data): void {
    let budgetReply = new BudgetReply();

    Materialize.toast('Enviando orçamento...', 20000);

    budgetReply.id = this.replyId;
    budgetReply.totalPrice = this.totalPrice;
    budgetReply.unitPrice = Boolean(this.units) ?
      UtilsService.parseMonetaryString(data.unitPrice) : budgetReply.totalPrice;
    budgetReply.availability = data.availability;
    budgetReply.productCode = data.productCode;
    budgetReply.status = 'Budgeted';
    budgetReply.note = data.note;
    budgetReply.colors = data.colors
      .toString()
      .replace(/[,]/g, ', ');

    this.replyServ
      .replyBudgetRequest(budgetReply)
      .subscribe(
      () => {
        this.replySent = true;
        (<any>Materialize).Toast.removeAll();        
        Materialize.toast('Orçamento enviado!', 5000);
      },
      (err) => {
        (<any>Materialize).Toast.removeAll();        
        Materialize.toast('Desculpe, ocorreu um erro', 5000);
      }
      );

  }

  createBudgetForm(budgetRequest, formBuilder, perUnit: boolean = true): FormGroup {
    let formGroupObj = {
      availability: [],
      colors: [[]],
      productCode: [],
      note: []
    }

    if (perUnit) {
      formGroupObj['unitPrice'] = [0, [
        Validators.required
      ]];
    } else {
      formGroupObj['totalPrice'] = [0, [
        Validators.required
      ]];
    }

    return formBuilder.group(formGroupObj);
  }

  ngOnInit(): void {
    this.budgetServ
      .getByReply(this.replyId)
      .subscribe(budgetRequest => {
        this.units = budgetRequest.measureUnit === 'units' ?
          Number(budgetRequest.quantity) : undefined;
        this.budgetRequest = budgetRequest;
        this.reply = this.budgetRequest.budgetReplies[0];

        this.budgetRequestLoad.emit(budgetRequest);
        this.budgetSenderForm = this.createBudgetForm(
          budgetRequest,
          this.fb,
          this.units !== undefined
        );

        if (this.reply.status !== 'Waiting') {
          this.budgetSenderForm.disable()
        }
      });
  }

  priceChanged(stringValue): void {
    let price = UtilsService.parseMonetaryString(stringValue);

    if (this.units !== undefined) {
      price = price * this.units;
    }

    this.totalPrice = price;
  }
}
