import { DataSource } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { MzModalService, MzToastService } from 'ng2-materialize';
import { TagInputComponent, TagInputDropdown } from 'ng2-tag-input';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { Budget } from '../shared/budget';
import { BudgetRequest } from '../shared/budget-request';
import { BudgetService } from '../shared/budget.service';
import { NewSupplierModal } from './new-supplier-modal.component';
import { Product } from '../shared/product';
import { Project } from '../shared/project';
import { Supplier } from '../shared/supplier';
import { SupplierService } from '../shared/supplier.service';
import { UtilsService } from '../../shared/utils/utils.service';

type Autocomplete = {
  data: { [key: string]: string },
  limit?: number,
  minLength?: number,
  onAutocomplete?: Function
}

@Component({
  selector: 'abx-project-budget-manager',
  templateUrl: './project-budget-manager.component.html',
  styleUrls: ['./project-budget-manager.component.scss']
})
export class ProjectBudgetManagerComponent implements OnInit {
  @Input() project: Project;

  productsAutocomplete: Autocomplete;
  suppliersAutocomplete: Autocomplete;
  suppliersAutocompleteData: { [key: string]: string };

  hasBudgets;
  newBudgetForm: FormGroup;
  newBudgetFormOpened: boolean;
  mascaraQuilos = createNumberMask({
    prefix: '',
    suffix: ' kg',
    thousandsSeparatorSymbol: '.',
    decimalSymbol: ',', // allowLeadingZeroes: true,
    allowDecimal: true, // requireDecimal: true
    // allowLeadingZeroes: true,
    requireDecimal: true
  });
  existingSupplier: boolean;
  budgetRequests: BudgetRequest[];
  firstAdded: boolean;
  storeAddSuggested: boolean = false;
  storesChipdata: { id: string, name: string }[] = [];
  displayedColumns = ['storeName', 'quantity', 'unitPrice', 'totalPrice', 'color', 'note'];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private bgService: BudgetService,
    private fb: FormBuilder,
    private modalService: MzModalService,
    private supplierService: SupplierService,
    private cdRef: ChangeDetectorRef,
    private toastService: MzToastService,
    private budgetService: BudgetService
  ) {
    this.newBudgetForm = this.createBudgetForm();
    this.budgetRequests = [];
  }

  getBudgetDataSource(requestId: string): BudgetDataSource {
    let budgetDataProvider =
      new BudgetDataProvider(this.budgetService, requestId);
    return new BudgetDataSource(budgetDataProvider);
  }

  ngOnInit() {
    this.supplierService.getAll()
      .subscribe((suppliers: Supplier[]) => {
        if (this.suppliersAutocompleteData === undefined) {
          this.suppliersAutocompleteData = {}
        }

        suppliers.forEach(s => {
          this.suppliersAutocompleteData[s.name] = null;
        });

        this.setAutocomplete();
      });

    this.project.ambiences.forEach(a => {
      // a.budgets.forEach(b => this.budgets.push(b))
    });

    this.newBudgetForm.get('supplier').valueChanges
      .debounceTime(250)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(val => {
        if (val && val.length) {
          // Validate
          this.supplierService.getOneByName(val)
            .subscribe(supplier => {

              // Clear Stores
              this.newBudgetForm.get('stores').setValue([{ value: 'ex', display: '+ponto de venda', id: 'ex', name: 'Ponto+' }], {
                onlySelf: false,
                emitEvent: false
              })

              // Fetch Stores
              if (supplier) {
                this.existingSupplier = true;

                if (supplier.stores && supplier.stores.length) {
                  this.storesChipdata = supplier.stores.map(s => {

                    return {
                      id: s.email,
                      name: s.name,
                    }
                  })

                } else {
                  this.storesChipdata = [];
                }

              } else {
                this.storesChipdata = [];
                this.existingSupplier = false;
              }
            });
          // Fetch Products

        } else {
          this.storesChipdata = []
          this.existingSupplier = false;
        }
      });

    this.newBudgetForm.get('quantityUnity').valueChanges
      .takeUntil(this.ngUnsubscribe)
      .subscribe(val => {
        this.newBudgetForm.get('units').disable();
        this.newBudgetForm.get('weight').disable();
        this.newBudgetForm.get('measurement2d').disable();
        this.newBudgetForm.get('measurement3d').disable();

        switch (val) {
          case 'unidade':
            this.newBudgetForm.get('units').enable();
            break;
          case 'peso':
            this.newBudgetForm.get('weight').enable();
            break;
          case 'medida2d':
            this.newBudgetForm.get('measurement2d').enable();
            break;
          case 'medida3d':
            this.newBudgetForm.get('measurement3d').enable();
            break;
          default:
            break;
        }
      })
  }

  logThis(that) {
    console.log(that);
    return true;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  removeBudget(id: string) {
    let index = this.budgetRequests.findIndex(b => b.id === id);
    this.budgetRequests.splice(index, 1);
  }

  toggleNewBudgetForm() {
    let $formContainer = $('#newBudgetFormContainer');

    if (this.newBudgetFormOpened === undefined) {
      this.newBudgetFormOpened = false
    }

    this.newBudgetFormOpened = !this.newBudgetFormOpened;

    if (this.newBudgetFormOpened) {
      $formContainer.slideDown({
        duration: 350,
        easing: "easeOutQuart",
        queue: false
      });
    } else {
      $formContainer.slideUp({
        duration: 350,
        easing: "easeOutQuart",
        queue: false
      });
    }
  }

  validateAndSendBudgetForm(formData: any, validatedSupplier?: Supplier) {
    let budgetRequest: BudgetRequest,
      supplier: Supplier,
      product: Product,
      quantity: string | number;

    console.log(formData);

    // Remove Tag Input examlpe
    let exampleIndex = formData.stores.findIndex(s => s.id === 'ex');
    if (exampleIndex > -1) {
      formData.stores.splice(exampleIndex, 1);
    }

    // Validating and Get Supplier
    if (this.existingSupplier && !validatedSupplier) {
      this.supplierService.getOneByName(formData.supplier)
        .subscribe(sup => {
          if (sup) {
            this.validateAndSendBudgetForm(formData, sup)
          } else {
            console.error('Erro ao buscar fornecedor');
          }
        });

      return;
    } else if (this.existingSupplier && validatedSupplier) {
      supplier = validatedSupplier;
    } else if (formData.supplier && formData.supplier.length) {
      supplier = new Supplier(formData.supplier);
    } else {
      console.error('Informe o fornecedor desta solicitação')
      return;
    }
    /*
      // Validating Supplier email 
      if (!this.existingSupplier && (!formData.supplierEmail || !(formData.supplierEmail.length > 0))) {
        console.error('Fornecedor novo aqui no Archabox? Informe o email dele')
        // console.error('É um fornecedor novo? Informe o email dele')
        return;
      }
    */

    // TODO: Validate and Get Stores
    if (formData.stores.length) {
    } else {
      this.toastService
        .show('Informe algum ponto de venda', 3000, 'red');
      return;
    }


    // Identifying and Validating quantity unit and Get Quantity 
    switch (formData.quantityUnity) {
      case 'unidade':
        let units: number = Number(formData.units);

        if (units !== NaN && units > 0) {
          quantity = units;
        } else {
          console.error('is not a valid quantity');
          return;
        }

        break;
      case 'peso':
        let weight: number = UtilsService.parseKilogramString(formData.weight);

        if (weight !== NaN && weight > 0) {
          quantity = weight;
        } else {
          console.error('is not a valid weight')
          return;
        }

        break;
      case 'medida2d':
        let measurement2d = formData.measurement2d;

        if (measurement2d
          && typeof measurement2d === 'string'
          && measurement2d.length) {
          quantity = measurement2d;
        } else {
          console.error('is not a valid measurement (2d)')
          return;
        }

        break;
      case 'medida3d':
        let measurement3d = formData.measurement3d;

        if (measurement3d
          && typeof measurement3d === 'string'
          && measurement3d.length) {
          quantity = measurement3d;
        } else {
          console.error('is not a valid measurement (3d)')
          return;
        }

        break;
      default:
        console.error('Unidade quantitativa desconhecida');
        return;
    }

    product = new Product(
      formData.productDesc,
      supplier
    );

    budgetRequest = new BudgetRequest(
      supplier,
      product,
      formData.quantityUnity,
      quantity,
      'Waiting'
    );

    budgetRequest.id = 'f933jt';
    budgetRequest.color = formData.color;
    budgetRequest.note = formData.note;
    budgetRequest.supplier.stores =
      formData.stores.map(s => {
        return {
          id: s.value,
          name: s.display,
        }
      });

    this.sendBudgetRequest(budgetRequest);
  }

  private createBudgetForm(budget?): FormGroup {
    let chipsData: any[] = [
      { value: 'ex', display: 'Ponto+', id: 'ex', name: 'Ponto+' }
    ];

    // chipsData = this.getPartnersByIds(ids).map((prof: any) => {
    //   prof.value = prof.id;
    //   prof.display = prof.name;
    //   return prof;
    // });

    let budgetForm = this.fb.group({
      supplier: ['', [
        Validators.required
      ]],
      // supplierEmail: ['', [
      //   // Validators.required,
      //   Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
      // ]],
      stores: [chipsData],
      productDesc: ['', [
        Validators.required
      ]],
      quantityUnity: ['unidade'],
      units: [1, Validators.required],
      weight: [1, Validators.required],
      measurement2d: ['', Validators.required],
      measurement3d: ['', Validators.required],
      color: [],
      note: []
    });

    budgetForm.get('units').disable();
    budgetForm.get('weight').disable();
    budgetForm.get('measurement2d').disable();
    budgetForm.get('measurement3d').disable();

    return budgetForm;
  }

  private sendBudgetRequest(budget: BudgetRequest) {
    this.toggleNewBudgetForm();
    // let bgts = [];
    if (this.budgetRequests.length === 0) {
      window.setTimeout(() => this.firstAdded = true, 350)
    }

    this.budgetRequests.push(budget);
    this.toastService.show('Solicitação enviada', 3000, 'green');
    // this.newBudgetForm.reset();

    // bgts = this.budgets;
    // bgts.push(budget);

    // this.budgets = []
    // this.cdRef.detectChanges();
    // this.budgets = bgts;
    // this.cdRef.detectChanges();
  }

  private setAutocomplete() {
    this.productsAutocomplete = {
      data: {
        'Armário': null,
        'Guarda roupa': null,
        'Sofá': null,
      },
      limit: 5,
      onAutocomplete: (val) =>
        this.updateFormData(val, this.newBudgetForm.get('productDesc'))
    };

    this.suppliersAutocomplete = {
      data: this.suppliersAutocompleteData,
      limit: 5,
      minLength: 0,
      onAutocomplete: (val) =>
        this.updateFormData(val, this.newBudgetForm.get('supplier'))
    };
  }

  private updateFormData(val: any, absControl: AbstractControl) {
    absControl.setValue(val, {
      onlySelf: false,
      emitEvent: true
    });
  }
}

/** An example database that the data source uses to retrieve data for the table. */
export class BudgetDataProvider {

  get data(): Observable<Budget[]> {
    return this.budgetService.getRequestReplies(this.requestId);
  }

  constructor(private budgetService: BudgetService, private requestId: string) {

  }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class BudgetDataSource extends DataSource<any> {

  constructor(private budgetProvider: BudgetDataProvider) {
    super();
  }

  connect(): Observable<any[]> {
    const source = this.budgetProvider.data;
    return source.map(budgets => budgets.map(b => {
      return {
        storeName: b.store.name,
        quantityUnity: b.quantityUnity,
        quantity: b.quantity,
        unitPrice: b.unitPrice,
        totalPrice: b.totalPrice,
        color: b.color,
        note: b.note
      }
    }));
  }

  disconnect() { }
}
