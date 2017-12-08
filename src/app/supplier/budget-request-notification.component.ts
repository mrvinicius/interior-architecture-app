import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { BudgetRequest } from './shared/budget-request';

@Component({
  selector: 'abx-budget-request-notification',
  template: `
    <div class="u-row">
      <p style="margin-top: 0;">Olá!
        <strong *ngIf="budgetRequest">{{budgetRequest.sender.name}}</strong> solicitou um orçamento de produto da sua loja.</p>
      <div class="u-col s6">
        <label for="name" class="readonly-value-label">produto</label>
        <p id="name" *ngIf="budgetRequest">{{budgetRequest.product.name}}</p>
      </div>
      <div class="u-col s6">
        <label for="quantity" class="readonly-value-label">
          <ng-container *ngIf="budgetRequest">
            <ng-container [ngSwitch]="budgetRequest.measureUnit">
              <ng-container *ngSwitchCase="'units'">unidades</ng-container>
              <ng-container *ngSwitchCase="'kg'">quilos</ng-container>
              <ng-container *ngSwitchCase="'measurement2d'">medida</ng-container>
              <ng-container *ngSwitchCase="'measurement3d'">medida</ng-container>
              <ng-container *ngSwitchCase="'liter'">litros</ng-container>
            </ng-container>
          </ng-container>
        </label>
        <p id="quantity" *ngIf="budgetRequest">{{budgetRequest.quantity}}</p>
      </div>
      <div class="u-col s6">
        <label for="color" class="readonly-value-label">cor</label>
        <p id="color" *ngIf="budgetRequest">
          {{budgetRequest.color || 'não especificado'}}
        </p>
      </div>
      <div class="u-col s12">
        <label for="note" class="readonly-value-label">observações</label>
        <p id="note" *ngIf="budgetRequest">
          {{budgetRequest.note || 'nenhuma observação'}}
        </p>
      </div>
    
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetRequestNotificationComponent {
  @Input()
  budgetRequest: BudgetRequest;
}
