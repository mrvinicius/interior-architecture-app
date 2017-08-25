import { Component, OnInit, Input } from '@angular/core';
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
    supplier: {
      alreadyExists: 'Este fornecedor já está na lista',
      required: 'Campo obrigatório'
    }
  };
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private bgService: BudgetService,
    private fb: FormBuilder,
    private modalService: MzModalService,
    private supplierService: SupplierService
  ) {
    this.newBudgetForm = this.createBudgetForm();
  }

  ngOnInit() {
    this.setAutocomplete();
    this.newBudgetForm.get('supplier').valueChanges
      .debounceTime(500)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(val => {
        if (val && val.length) {
          // Fetch subsidiaries
        } else {
          // Clear subsidiaries
        }
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  openNewSupplierModal() {
    this.modalService.open(NewSupplierModal, {})
  }

  sendBudgetRequest(formData: any) {
    let budget: Budget,
      product: Product,
      quantityUnity: any;

    // Identifying quantity unit
    switch (formData.quantityUnity) {
      case 'unidade':
        let units: number = Number(formData.units);
        quantityUnity = units;

        break;
      case 'peso':
        let weight: number = UtilsService.parseKilogramString(formData.weight);
        quantityUnity = weight;

        break;
      case 'medida2d':
        let measurement2d = formData.measurement2d;
        quantityUnity = measurement2d;

        break;
      case 'medida3d':
        let measurement3d = formData.measurement3d;
        quantityUnity = measurement3d;

        break;
      default:
        console.error('Unidade quantitativa desconhecida');
        break;
    }

    this.supplierService.getOneByName(name)
      .subscribe(supplier => {
        if (supplier) {
          // this.newBudgetForm.get('productDesc').enable();
          // this.newBudgetForm.controls
        } else {
          // Trigger nonexistent supplier error, please provide supplier email
          // Não conhecemos esse fornecedor, por favor informe email dele
        }
      })

    // switch (formData.quantityUnity) {
    //   case 'unidade':
    //     let units: number = Number(formData.units);

    //     if (units !== NaN && units > 0) {
    //       quantityUnity = units;
    //     } else {
    //       console.error('is not a valid quantity');
    //     }

    //     break;
    //   case 'peso':
    //     let weight: number = UtilsService.parseKilogramString(formData.weight);

    //     if (weight !== NaN && weight > 0) {
    //       quantityUnity = weight;
    //     } else {
    //       console.error('is not a valid weight')
    //     }

    //     break;
    //   case 'medida2d':
    //     let measurement2d = formData.measurement2d;

    //     if (measurement2d
    //       && typeof measurement2d === 'string'
    //       && measurement2d.length) {
    //       quantityUnity = measurement2d;
    //     } else {
    //       console.error('is not a valid measurement (2d)')
    //     }

    //     break;
    //   case 'medida3d':
    //     let measurement3d = formData.measurement3d;

    //     if (measurement3d
    //       && typeof measurement3d === 'string'
    //       && measurement3d.length) {
    //       quantityUnity = measurement3d;
    //     } else {
    //       console.error('is not a valid measurement (3d)')
    //     }

    //     break;
    //   default:
    //     console.error('Unidade quantitativa desconhecida');
    //     break;
    // }
    // validar se o texto fornecedor está na lista
    // 

    // product = new Product();
    // budget = new Budget();

    console.log(formData);
    console.log(quantityUnity);
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

  private createBudgetForm(budget?): FormGroup {
    let supplierId = '0';
    let chipsData: { value: string; display: string }[] = [];

    return this.fb.group({
      supplier: ['', [
        Validators.required
      ]],
      subsidiary: [chipsData],
      productDesc: ['', [
        Validators.required
      ]],
      quantityUnity: ['unidade'],
      units: [0, Validators.required],
      weight: [0.0, Validators.required],
      measurement2d: ['', Validators.required],
      measurement3d: ['', Validators.required],
      color: [],
      note: []
    });
  }

  private updateFormData(val: any, absControl: AbstractControl) {
    absControl.setValue(val, {
      onlySelf: false,
      emitEvent: false
    });
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
      data: {
        'Deca': null,
        'Ornare': null,
        'Breton': null,
        'Coral': null,
        'BrentWood': null,
        "Bell' arte": null
      },
      limit: 5,
      minLength: 1,
      onAutocomplete: (val) =>
        this.updateFormData(val, this.newBudgetForm.get('supplier'))
    };
  }
}
