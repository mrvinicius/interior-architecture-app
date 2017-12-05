import { Component, OnInit, EventEmitter, Input, Output, OnChanges } from '@angular/core';

import { BudgetRequest } from '../shared/budget-request';
import { BudgetReply } from '../shared/budget-reply';
import { ReplyDataSource } from '../shared/reply-data-source';

@Component({
  selector: 'abx-budget-request-list',
  templateUrl: './budget-request-list.component.html',
  styleUrls: ['./budget-request-list.component.css']
})
export class BudgetRequestListComponent {


  constructor() { }


  ngOnInit() {
  }

}

