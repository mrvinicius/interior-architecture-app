import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators, ValidatorFn } from '@angular/forms';

import { MaterializeAction } from "angular2-materialize";

import { BudgetReply } from '../shared/budget-reply';
import { BudgetRequest } from '../shared/budget-request';
import { Product } from '../shared/product';
import { Store } from '../shared/store';
import { Supplier } from '../shared/supplier';

@Component({
  selector: 'abx-budget-requester',
  templateUrl: './budget-requester.component.html',
  styleUrls: ['./budget-requester.component.scss']
})
export class BudgetRequesterComponent implements OnInit {
  @Input('suppliers')
  set suppliers(suppliers: Supplier[]) {
    if (suppliers) {
      this._suppliersKeys = {};

      suppliers.forEach(sup => this._suppliersKeys[sup.name] = null)
      this.supplierAutocompleteParams.data = this._suppliersKeys;
      this._suppliers = suppliers;

    }
  }
  @Input('products')
  set products(products: Product[]) {
    if (products) {
      this._productsKeys = {};
      this.productAutocompleteParams = null;

      products.forEach(prod => this._productsKeys[prod.name] = null);

      this.productAutocompleteParams = {
        data: this._productsKeys,
        limit: 5,
        minLength: 1
      }

      this._products = products;
    }
  }

  @Output()
  supplierChange = new EventEmitter<Supplier>();
  @Output()
  budgetRequestSubmit = new EventEmitter<BudgetRequest>();

  _suppliersKeys: { [name: string]: string };
  _suppliers: Supplier[];
  supplierForm: FormGroup;
  selectedSupplier: Supplier;
  selectedProduct: Product;
  supplierAutocompleteParams = {
    data: this._suppliersKeys,
    limit: 5,
    minLength: 1
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
  productAutocompleteParams = {};

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
        this.chipRequiredValidator()
      ]],
    });

    this.supplierForm.get('supplier')
      .valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(val => this.supplierChanged(val));

    this.productForm = this.fb.group({
      productDesc: ['', [
        Validators.required
      ]],
      measureUnit: [initMeasureUnit, Validators.required],
      units: [1, Validators.required],
      kg: [0.1, Validators.required],
      measurement2d: ['', Validators.required],
      measurement3d: ['', Validators.required],
      liter: [0.1, Validators.required]
    });

    this.productForm.get('productDesc')
      .valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(val => this.productChanged(val))

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

  getProduct(productDesc: string, productKeys, products: Product[]): Product | null {
    let product,
      descriptionLower = productDesc.toLowerCase(),
      existentProduct: boolean;

    for (let prop in productKeys) {
      if (prop.toLowerCase() === descriptionLower) {
        existentProduct = true;
        break;
      }
    }

    return existentProduct ?
      products.find(product => product.name.toLowerCase() === descriptionLower) : null;
  }

  deleteStoreChip(chipData): void {
    let storesValue = this.supplierForm.value['stores'],
      removedIndex = storesValue.findIndex(store => store.tag === chipData.tag);

    storesValue.splice(removedIndex, 1);
    this.supplierForm.get('stores')
      .setValue(storesValue, { onlySelf: false, emitEvent: false })
  }

  getSupplier(name: string, supplierKeys, suppliers: Supplier[]): Supplier {
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

  productChanged(val: string): void {
    this.selectedProduct = this.getProduct(val, this._productsKeys, this._products);

  }

  sendRequest(): void {
    let budgetRequest: BudgetRequest,
      measureUnit = this.productForm.get('measureUnit').value,
      quantity,
      product: Product,
      storeChips: any[],
      selectedStores: Store[];

    switch (measureUnit) {
      case 'units':
        quantity = this.productForm.get('units').value;
        break;
      case 'kg':
        quantity = this.productForm.get('kg').value;
        break;
      case 'measurement2d':
        quantity = this.productForm.get('measurement2d').value;
        break;
      case 'measurement3d':
        quantity = this.productForm.get('measurement3d').value;
        break;
      case 'liter':
        quantity = this.productForm.get('liter').value;
      default:
        console.error('invalid measure unit', measureUnit)
        break;
    }

    budgetRequest = new BudgetRequest(
      this.selectedSupplier,
      measureUnit,
      quantity
    );

    if (this.selectedProduct) {
      budgetRequest.product = this.selectedProduct;
    } else {
      budgetRequest.newProductName = this.productForm.get('productDesc').value;
    }

    storeChips = this.supplierForm.get('stores').value;

    selectedStores = storeChips.map(chipData =>
      this.selectedSupplier.stores.find(store => store.name === chipData.tag)
    );

    budgetRequest.budgetReplies = selectedStores.map(store => new BudgetReply(store));
    budgetRequest.color = this.noteForm.get('color').value;
    budgetRequest.note = this.noteForm.get('note').value;

    this.budgetRequestSubmit.emit(budgetRequest);
  }

  supplierChanged(val: string): void {
    let supplier,
      stores;

    if (this.supplierForm.get('supplier').errors) {
      this.selectedSupplier = null;
      this.storeChipsParams.autocompleteOptions.data = {};
      this.storeChipsParams.data = [];
      this.supplierForm.get('stores').setValue([], { onlySelf: false, emitEvent: false });
      this.productAutocompleteParams = null;
      this.chipsActions.emit({ action: 'material_chip', params: [this.storeChipsParams] });
      return;
    }

    supplier = this.getSupplier(val, this._suppliersKeys, this._suppliers);
    stores = supplier.stores;
    this.selectedSupplier = supplier;
    this.supplierChange.emit(supplier);
    this.storeChipsParams = this.getUpdatedStoreChips(stores, this.storeChipsParams);

    if (stores) {
      this.chipsActions.emit({ action: 'material_chip', params: [this.storeChipsParams] });
      stores.forEach(store => this.addStoreChip({ tag: store.name, id: store.id }));
    }
  }

  private chipRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      return Array.isArray(control.value) && control.value.length ? null : { 'noarraylist': true };
    }
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
    this.productForm.get('liter').disable();

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
      case 'liter':
        this.productForm.get('liter').enable();
      default:
        break;
    }
  }
}
