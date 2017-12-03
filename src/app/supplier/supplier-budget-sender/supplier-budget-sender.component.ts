import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MaterializeAction } from 'angular2-materialize';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
  selector: 'abx-supplier-budget-sender',
  templateUrl: './supplier-budget-sender.component.html'
})
export class SupplierBudgetSenderComponent implements OnInit {
  @Output()
  budgetSubmit = new EventEmitter<any>();
  @Output()
  priceChange = new EventEmitter<string>();
  @Input()
  set senderFormGroup(formGroup: FormGroup) {
    if (formGroup) {
      let formControlName = formGroup.controls['totalPrice'] ? 'totalPrice' : 'unitPrice';
      this._senderFormGroup = formGroup;
      this._senderFormGroup.get(formControlName)
        .valueChanges
        .subscribe(val => this.priceChange.emit(val))
    }
  }
  get senderFormGroup(): FormGroup {
    return this._senderFormGroup;
  }
  private _senderFormGroup: FormGroup;

  currencyMask = createNumberMask({
    prefix: 'R$ ',
    thousandsSeparatorSymbol: '.',
    decimalSymbol: ',', // allowLeadingZeroes: true,
    allowDecimal: true, // requireDecimal: true
  });

  readonly chipsActions = new EventEmitter<string | MaterializeAction>();
  readonly colorChipsParams = {
    placeholder: 'digite + ENTER',
    secondaryPlaceholder: '+cor'
  };

  constructor() { }

  ngOnInit() {

  }

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

}
