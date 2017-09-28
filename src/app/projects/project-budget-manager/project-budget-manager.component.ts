import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { MzModalService } from 'ng2-materialize';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { Budget } from '../shared/budget';
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
  errorMessageResource = {
    // supplier: {
    //   alreadyExists: 'Este fornecedor já está na lista',
    //   required: 'Campo obrigatório'
    // }
    supplier: 'Não conhecemos este fornecedor'
  };
  existingSupplier: boolean;
  budgets: Budget[];
  firstAdded: boolean;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private bgService: BudgetService,
    private fb: FormBuilder,
    private modalService: MzModalService,
    private supplierService: SupplierService,
    private cdRef: ChangeDetectorRef
  ) {
    this.newBudgetForm = this.createBudgetForm();

    this.budgets = [];

  }

  deleteBudget(id: string) {
    console.log(id);

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
              if (supplier) {
                this.existingSupplier = true;
                this.newBudgetForm.get('supplierEmail').disable();
              } else {
                this.existingSupplier = false;
                this.newBudgetForm.get('supplierEmail').enable();
              }
            });

          // Fetch Subsidiaries

          // Fetch Products

        } else {
          this.existingSupplier = false;
          this.newBudgetForm.get('supplierEmail').enable();

          // Clear subsidiaries
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

  openBudgetEditionMode(id: string) {
    console.log(id);
  }

  openNewSupplierModal() {
    this.modalService.open(NewSupplierModal, {})
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
    let budget: Budget,
      supplier: Supplier,
      product: Product,
      quantity: string | number;

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
      supplier = new Supplier(formData.supplier, formData.supplierEmail);
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

    // TODO: Validate and Get Subsidiaries

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
      supplier,
      formData.quantityUnity,
      quantity
    );
    product.color = formData.color;
    product.note = formData.note;

    budget = new Budget(supplier, product, 'Waiting');
    budget.id = 'f933jt';
    budget.subsidiaries = formData.subsidiaries.map(s => {
      return {
        id: s.value,
        name: s.display,
      }
    });
    budget.supplier.subsidiaries = budget.subsidiaries;

    this.sendBudgetRequest(budget);
  }

  private createBudgetForm(budget?): FormGroup {
    let chipsData: { value: string; display: string }[] = [];

    let budgetForm = this.fb.group({
      supplier: ['', [
        Validators.required
      ]],
      supplierEmail: ['', [
        // Validators.required,
        Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
      ]],
      subsidiaries: [chipsData],
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

  private sendBudgetRequest(budget: Budget) {
    this.toggleNewBudgetForm();
    let bgts = [];
    // this.newBudgetForm.reset();
    if (this.budgets.length === 0) {
      window.setTimeout(() => this.firstAdded = true, 350)
    }

    bgts = this.budgets;
    bgts.push(budget);

    this.budgets = []
    this.cdRef.detectChanges();
    this.budgets = bgts;
    this.cdRef.detectChanges();
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
