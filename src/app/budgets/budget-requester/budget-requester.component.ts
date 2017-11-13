import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators, ValidatorFn } from '@angular/forms';

import { MaterializeAction } from "angular2-materialize";

import { Supplier } from '../shared/supplier';
import { Store } from '../shared/store';
import { Product } from '../shared/product';

@Component({
  selector: 'abx-budget-requester',
  templateUrl: './budget-requester.component.html',
  styleUrls: ['./budget-requester.component.scss']
})
export class BudgetRequesterComponent implements OnInit {
  @Input('suppliers')
  set suppliers(suppliers: Supplier[]) {
    this._suppliers = suppliers;
    this._suppliersKeys = {};

    suppliers.forEach(sup => this._suppliersKeys[sup.name] = null)
    this.supplierAutocompleteParams.data = this._suppliersKeys;
  }
  @Input('products')
  set products(products: Product[]) {
    if (products) {
      this._productsKeys = {};
      products.forEach(prod => this._productsKeys[prod.name] = null)
      this.productAutocompleteParams.data = this._productsKeys;
    }
  }

  @Output() supplierChange = new EventEmitter<Supplier>();

  _suppliersKeys: { [name: string]: string };
  _suppliers: Supplier[];
  supplierForm: FormGroup;
  supplierAutocompleteParams = {
    data: this._suppliersKeys,
    limit: 5,
    minLength: 1,
    onAutocomplete: (val) =>
      this.supplierChanged(val)
  };
  storeChipsParams = {
    autocompleteOptions: { data: {}, limit: 5, minLength: 1 },
    placeholder: '+ponto de venda',
    secondaryPlaceholder: '+ponto de venda',
    data: []
  };

  _productsKeys: { [name: string]: string };
  _products: Product[];
  productForm: FormGroup;
  productAutocompleteParams = {
    data: this._productsKeys,
    limit: 5,
    minLength: 1
  }

  noteForm: FormGroup;
  readonly chipsActions = new EventEmitter<string | MaterializeAction>();

  constructor(private fb: FormBuilder) {
    let initMeasureUnit = 'units';

    this.supplierForm = this.fb.group({
      supplier: ['', [
        Validators.required,
        this.existentSupplierValidator()
      ]],
      stores: [[], [
        Validators.required,
      ]],
    });

    this.productForm = this.fb.group({
      productDesc: ['', [
        Validators.required
      ]],
      measureUnit: [initMeasureUnit, Validators.required],
      units: [1, Validators.required],
      kg: [1, Validators.required],
      measurement2d: ['', Validators.required],
      measurement3d: ['', Validators.required]
    });

    this.handleMeasurementsFieldsControl(initMeasureUnit);

    this.noteForm = this.fb.group({
      color: [],
      note: []
    });
  }

  ngOnInit() {
  }

  addStoreChip(chipData): void {
    let storesValue = this.supplierForm.value['stores'] ? this.supplierForm.value['stores'] : []

    this.supplierForm.get('stores')
      .setValue([...storesValue, chipData], { onlySelf: false, emitEvent: false })

  }
  deleteStoreChip(chipData): void {
    let storesValue = this.supplierForm.value['stores'],
      removedIndex = storesValue.findIndex(store => store.tag === chipData.tag);

    storesValue.splice(removedIndex, 1);
    this.supplierForm.get('stores')
      .setValue(storesValue, { onlySelf: false, emitEvent: false })
  }
  selectStoreChip(chipData): void { }

  measureChanged(val): void {
    this.handleMeasurementsFieldsControl(val)
  }

  supplierChanged(val): void {
    let supplier,
      stores;

    if (this.supplierForm.get('supplier').errors) {
      this.storeChipsParams.autocompleteOptions.data = {}
      this.storeChipsParams.data = [];
      this.supplierForm.get('stores').setValue([], { onlySelf: false, emitEvent: false });
      this.chipsActions.emit({ action: 'material_chip', params: [this.storeChipsParams] });
      return;
    }

    supplier = this.getSupplierStores(val, this._suppliersKeys, this._suppliers);
    this.supplierChange.emit(supplier);
    stores = supplier.stores;
    this.storeChipsParams = this.getUpdatedStoreChips(stores, this.storeChipsParams);

    if (stores) {
      this.chipsActions.emit({ action: 'material_chip', params: [this.storeChipsParams] });
      stores.forEach(store => this.addStoreChip({ tag: store.name, id: store.id }));
    }
  }

  getSupplierStores(name: string, supplierKeys, suppliers: Supplier[]): Supplier {
    let supplier,
      nameLower = name.toLowerCase(),
      existentSupplier: boolean;

    for (let prop in supplierKeys) {
      if (prop.toLowerCase() === nameLower) {
        existentSupplier = true;
        break;
      }
    }

    return existentSupplier ?
      suppliers.find(sup => sup.name.toLowerCase() === nameLower) : null;
  }

  getUpdatedStoreChips(stores: Store[], currentChips): any {
    if (stores && stores.length) {
      stores.forEach(store => {
        let chipData = { tag: store.name, id: store.id };
        currentChips.autocompleteOptions.data[store.name] = null;
        currentChips.data.push(chipData);
      });
    }

    return currentChips;
  }

  private existentSupplierValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let existent, lowerValue = control.value.toLowerCase();

      for (let supProp in this._suppliersKeys) {
        if (supProp.toLowerCase() === lowerValue) {
          existent = true;
          break;
        }
      }

      return existent ? null : { 'noexistent': true };
    }
  }

  private handleMeasurementsFieldsControl(controlName: string): void {
    this.productForm.get('units').disable();
    this.productForm.get('kg').disable();
    this.productForm.get('measurement2d').disable();
    this.productForm.get('measurement3d').disable();

    switch (controlName) {
      case 'units':
        this.productForm.get('units').enable();
        break;
      case 'kg':
        this.productForm.get('kg').enable();
        break;
      case 'measurement2d':
        this.productForm.get('measurement2d').enable();
        break;
      case 'measurement3d':
        this.productForm.get('measurement3d').enable();
        break;
      default:
        break;
    }
  }
}
