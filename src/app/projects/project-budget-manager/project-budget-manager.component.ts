import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MzModalService } from 'ng2-materialize';

import { NewBudgetModalComponent } from '../new-budget-modal/new-budget-modal.component';
import { Project } from '../shared/project';

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

  constructor(
    private fb: FormBuilder,
    private modalService: MzModalService
  ) {
    this.newBudgetForm = this.createBudgetForm();
  }

  ngOnInit() {
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

    });
  }
}
