import { Component, OnInit, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators, ValidatorFn } from '@angular/forms';

import { MaterializeAction } from "angular2-materialize";

import { Subject } from 'rxjs/Subject';

import { BudgetReply } from '../shared/budget-reply';
import { BudgetRequest } from '../shared/budget-request';
import { Product } from '../shared/product';
import { Store } from '../shared/store';
import { Supplier } from '../shared/supplier';

type AutocompleteParams = {
  data: { [name: string]: string },
  limit: number,
  minLength: number
}

@Component({
  selector: 'abx-budget-requester',
  templateUrl: './budget-requester.component.html',
  styleUrls: ['./budget-requester.component.scss']
})
export class BudgetRequesterComponent implements OnInit, OnDestroy {
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
  supplierForm: FormGroup;
  selectedSupplier: Supplier;
  selectedProduct: Product;
  private _suppliersKeys: { [name: string]: string };
  supplierAutocompleteParams: AutocompleteParams = {
    data: this._suppliersKeys,
    limit: 5,
    minLength: 0
  };
  storeAutocompleteParams: AutocompleteParams = {
    data: {},
    limit: 5,
    minLength: 0
  }
  productForm: FormGroup;
  productAutocompleteParams = {};
  supplierInvalid: boolean = false;
  noteForm: FormGroup;
  readonly storeAutocompleteActions = new EventEmitter<string | MaterializeAction>();
  private _suppliers: Supplier[];
  private _products: Product[];
  private _productsKeys: { [name: string]: string };
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder) {
    let initMeasureUnit = 'units',
      storeInputControl;

    this.supplierForm = this.fb.group({
      supplier: ['', [
        Validators.required,
        this.existentSupplierValidator()
      ]],
      storeInput: [{ value: '', disabled: true }],
      stores: [[], [
        Validators.required,
        this.chipRequiredValidator()
      ]],
    });
    storeInputControl = this.supplierForm.get('storeInput');

    this.supplierForm.get('supplier')
      .valueChanges
      .takeUntil(this.ngUnsubscribe)
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(val => this.supplierChanged(val, storeInputControl));

    storeInputControl
      .valueChanges
      .takeUntil(this.ngUnsubscribe)
      .debounceTime(100)
      .distinctUntilChanged()
      .subscribe(val => this.storeInputChanged(val, storeInputControl));

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
      .takeUntil(this.ngUnsubscribe)
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(val => this.productChanged(val))

    this.handleMeasurementsFieldsControl(initMeasureUnit);

    this.noteForm = this.fb.group({
      color: [],
      note: []
    });

  }

  addStoreAutocompleteItem(name) {
    this.storeAutocompleteParams.data[name] = null;
    this.updateAutocomplete(
      this.storeAutocompleteActions,
      this.storeAutocompleteParams,
      this.supplierForm.get('storeInput')
    );
  }

  addStoreChip(store, form): void {
    let storesValue = form.value['stores'] ? form.value['stores'] : [],
      chipData = {
        id: store.id,
        name: store.name
      }

    form.get('stores')
      .setValue([...storesValue, chipData], { onlySelf: false, emitEvent: false })
  }

  checkSupplierErrors() {
    let inputControl = this.supplierForm.get('supplier');

    if (inputControl.errors) {
      if (!((inputControl.value || '').trim())) {
        this.supplierInvalid = false;
        return;
      }

    this.supplierInvalid = inputControl.errors.noexistent || false;
    } else {
      this.supplierInvalid = false;
    }
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

  getSupplier(name: string, supplierKeys, suppliers: Supplier[]): Supplier {
    let nameLower = name.toLowerCase(),
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

  handleMeasurementsFieldsControl(controlName: string): void {
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

  ngOnInit() { }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  productChanged(val: string): void {
    this.selectedProduct = this.getProduct(val, this._productsKeys, this._products);
  }

  removeStoreChip(id, form): void {
    let storesValue = form.value['stores'],
      index = storesValue.findIndex(store => id.toLowerCase() === store.id.toLowerCase());

    storesValue.splice(index, 1);
    form.get('stores')
      .setValue(storesValue, { onlySelf: false, emitEvent: false });
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
        break;
      default:
        console.error('invalid measure unit: ', measureUnit)
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
      this.selectedSupplier.stores.find(store => chipData.id === store.id)
    );
    budgetRequest.budgetReplies = selectedStores.map(store => new BudgetReply(store));
    budgetRequest.color = this.noteForm.get('color').value;
    budgetRequest.note = this.noteForm.get('note').value;
    this.budgetRequestSubmit.emit(budgetRequest);
  }

  storeInputChanged(inputVal: string, storeInputControl: AbstractControl): void {
    let value = inputVal.trim().toLowerCase(),
      existentStoreOfSupplier: boolean,
      store: Store,
      selectedStoreName: string;

    for (let storeProp in this.storeAutocompleteParams.data) {
      if (value === storeProp.toLowerCase()) {
        selectedStoreName = storeProp;
        existentStoreOfSupplier = true;
        break;
      }
    }

    if (existentStoreOfSupplier) {
      let storesValue, chipData;
      store = this.selectedSupplier.stores.find(store => value === store.name.toLowerCase());

      if (!store) {
        console.error('Loja presente na lista, mas não encontrada no Fornecedor Selecionado')
        return;
      }

      this.addStoreChip(store, this.supplierForm);
      delete this.storeAutocompleteParams.data[selectedStoreName];

      this.updateAutocomplete(
        this.storeAutocompleteActions,
        this.storeAutocompleteParams,
        storeInputControl
      );
    }
  }

  supplierChanged(val: string, storeInputControl: AbstractControl): void {
    if (this.supplierForm.get('supplier').errors) {
      storeInputControl.disable()
      this.selectedSupplier = null;
      this.storeAutocompleteParams.data = {};
      this.updateAutocomplete(
        this.storeAutocompleteActions,
        this.storeAutocompleteParams,
        storeInputControl
      );

      this.supplierForm.get('stores').setValue([], { onlySelf: false, emitEvent: false });
      this.productAutocompleteParams = null;
      return;
    }
    storeInputControl.enable()
    this.supplierInvalid = false;
    this.selectedSupplier = this.getSupplier(val, this._suppliersKeys, this._suppliers);
    this.supplierChange.emit(this.selectedSupplier);

    if (this.selectedSupplier.stores) {
      this.storeAutocompleteParams.data = {};
      this.selectedSupplier.stores.forEach(s => this.storeAutocompleteParams.data[s.name] = null)
      this.updateAutocomplete(
        this.storeAutocompleteActions,
        this.storeAutocompleteParams,
        storeInputControl
      );
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
        if (lowerValue === supProp.toLowerCase()) {
          existent = true;
          break;
        }
      }

      return existent ? null : { 'noexistent': true };
    }
  }

  private updateAutocomplete(actions, autocompleteParams, inputControl: AbstractControl): void {
    inputControl.setValue('', { onlySelf: false, emitEvent: false });
    actions.emit({ action: 'autocomplete', params: [autocompleteParams] });
  }
}
