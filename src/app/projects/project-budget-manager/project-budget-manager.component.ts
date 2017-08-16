import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { MzModalService } from 'ng2-materialize';

import { NewBudgetModalComponent } from '../new-budget-modal/new-budget-modal.component';
import { Project } from '../shared/project';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
  selector: 'abx-project-budget-manager',
  templateUrl: './project-budget-manager.component.html',
  styleUrls: ['./project-budget-manager.component.scss']
})
export class ProjectBudgetManagerComponent implements OnInit {
  @Input() project: Project;
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

  constructor(
    private fb: FormBuilder,
    private modalService: MzModalService
  ) {
    this.newBudgetForm = this.createBudgetForm();
  }

  ngOnInit() {
  }

  sendBudgetRequest(formData: any) {
    console.log(formData);

    switch (formData.quantityUnity) {
      case 'unidade':
        let units: number = Number(formData.units);
        if (units === NaN) {
          // Erro no campo NÚMERO DE UNIDADES
          return;
        }

        break;
      case 'peso':
        let weight: number = UtilsService.parseKilogramString(formData.peso);
        if (weight === NaN) {
          // Erro no campo PESO
          return;
        }
        break;
      case 'medida2d':

        break;
      case 'medida3d':
        break;

      default:
        console.error('Unidade quantitativa desconhecida');
        break;
    }

  }

  toggleNewBudgeForm() {
    let $formContainer = $('#newBudgetFormContainer');

    if (this.newBudgetFormOpened === undefined)
      this.newBudgetFormOpened = false

    this.newBudgetFormOpened = !this.newBudgetFormOpened;

    // console.log(this.newBudgetFormOpened);

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
      supplierId: [supplierId],
      subsidiary: [chipsData],
      productDesc: [],
      quantityUnity: ['unidade'],
      units: [],
      weight: [],
      measurement2d: [],
      measurement3d: [],
      color: []
    });
  }
}
