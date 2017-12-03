import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MaterializeAction } from 'angular2-materialize';

import { Subject } from 'rxjs/Subject';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
  selector: 'abx-supplier-budget-sender',
  templateUrl: './supplier-budget-sender.component.html'
})
export class SupplierBudgetSenderComponent implements OnInit, OnDestroy {
  @Output()
  budgetSubmit = new EventEmitter<any>();
  @Output()
  priceChange = new EventEmitter<string>();
  @Input()
  set senderFormGroup(formGroup: FormGroup) {
    if (formGroup) {
      let formControlName = formGroup.controls['totalPrice'] ? 'totalPrice' : 'unitPrice';
      this._senderFormGroup = formGroup;
      // this._senderFormGroup.get(formControlName)
      //   .valueChanges
      //   .takeUntil(this.ngUnsubscribe)
      //   .subscribe(val => this.priceChange.emit(val))
    }
  }
  get senderFormGroup(): FormGroup {
    return this._senderFormGroup;
  }

  currencyMask = createNumberMask({
    prefix: 'R$ ',
    thousandsSeparatorSymbol: '.',
    decimalSymbol: ',', // allowLeadingZeroes: true,
    allowDecimal: true, // requireDecimal: true
  });
  readonly chipsActions = new EventEmitter<string | MaterializeAction>();
  readonly colorChipsParams = { placeholder: 'cor + ENTER', secondaryPlaceholder: '+cor' };
  private _senderFormGroup: FormGroup;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor() { }

  addStoreChip(chipData, form): void {
    let colorsValue = form.value['colors'] ? form.value['colors'] : []

    form.get('colors')
      .setValue([...colorsValue, chipData], {
        onlySelf: false,
        emitEvent: false
      });
  }

  deleteStoreChip(chipData, form): void {
    let colorsValue = form.value['colors'],
      removedIndex = colorsValue.findIndex(color => color.tag === chipData.tag);

    colorsValue.splice(removedIndex, 1);
    form.get('colors')
      .setValue(colorsValue, { onlySelf: false, emitEvent: false })
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  priceChanged(value, formControlName) {
    this.priceChange.emit(value);
  }
}
