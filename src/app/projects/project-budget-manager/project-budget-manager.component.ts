import { Component, OnInit, Input } from '@angular/core';
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
  newBudgetFormOpened: boolean;

  constructor(
    private modalService: MzModalService
  ) {

  }

  ngOnInit() {
  }

  toggleNewBudgeForm() {
    let $formContainer = $('#newBudgetFormContainer');

    if (this.newBudgetFormOpened === undefined)
      this.newBudgetFormOpened = false

    this.newBudgetFormOpened = !this.newBudgetFormOpened;

    console.log(this.newBudgetFormOpened);
    
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

}
