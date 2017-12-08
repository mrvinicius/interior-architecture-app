import { ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';

import { MaterializeAction } from 'angular2-materialize';

import { Subject } from 'rxjs/Subject';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';

const COMMA = 188;

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

  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  fruits = [
    { name: 'Lemon' },
    { name: 'Lime' },
    { name: 'Apple' },
  ];


  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our person
    if ((value || '').trim()) {
      this.fruits.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    let index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

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
