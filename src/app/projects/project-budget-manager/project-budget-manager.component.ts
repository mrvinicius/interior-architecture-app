import { Component, OnInit, Input } from '@angular/core';

import { Project } from '../shared/project';

@Component({
  selector: 'abx-project-budget-manager',
  templateUrl: './project-budget-manager.component.html',
  styleUrls: ['./project-budget-manager.component.scss']
})
export class ProjectBudgetManagerComponent implements OnInit {
  @Input() project: Project;

  constructor() { }

  ngOnInit() {
  }

}
