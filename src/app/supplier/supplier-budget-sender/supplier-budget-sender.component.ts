import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MaterializeAction } from 'angular2-materialize';

import { Subject } from 'rxjs/Subject';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
  selector: 'abx-supplier-budget-sender',
  templateUrl: './supplier-budget-sender.component.html'
})
export class SupplierBudgetSenderComponent implements OnInit {
  @Input()
  senderFormGroup: FormGroup;
  @Output()
  budgetSubmit = new EventEmitter<any>();
  @Output()
  priceChange = new EventEmitter<string>();
  buttonDisabled = false;
  currencyMask = createNumberMask({
    prefix: 'R$ ',
    thousandsSeparatorSymbol: '.',
    decimalSymbol: ',', // allowLeadingZeroes: true,
    allowDecimal: true, // requireDecimal: true
  });
  readonly chipsActions = new EventEmitter<string | MaterializeAction>();
  readonly colorChipsParams = { placeholder: 'cor + ENTER', secondaryPlaceholder: '+cor' };
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

  priceChanged(value, formControlName) {
    this.priceChange.emit(value);
  }

  submit() {
    if (this.senderFormGroup.invalid) {
      return;
    }

    this.buttonDisabled = true;
    this.budgetSubmit.emit(this.senderFormGroup.value)
  }
}
