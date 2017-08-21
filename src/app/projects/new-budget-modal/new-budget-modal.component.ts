import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MzBaseModal } from 'ng2-materialize';

@Component({
  selector: 'abx-new-budget-modal',
  templateUrl: './new-budget-modal.component.html',
  styleUrls: ['./new-budget-modal.component.css']
})
export class NewBudgetModalComponent extends MzBaseModal {
  budgetForm: FormGroup;
  
  constructor(
    private fb: FormBuilder
  ) {
    super()
    this.budgetForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      
    })
  }
}
