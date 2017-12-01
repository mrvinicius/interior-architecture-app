import { Component, OnInit, Input } from '@angular/core';

import { BudgetRequest } from '../shared/budget-request';
import { ReplyDataSource, displayedColumns } from '../shared/reply-data-source';

@Component({
  selector: 'abx-budget-request',
  templateUrl: './budget-request.component.html',
  styleUrls: ['./budget-request.component.css']
})
export class BudgetRequestComponent implements OnInit {
  @Input('request')
  set request(request: BudgetRequest) {
    this._request = request;
    this.replySource = new ReplyDataSource(this._request.budgetReplies);
  }

  get request() {
    return this._request;
  }

  replySource: ReplyDataSource;
  readonly displayedColumns = displayedColumns;
  private _request: BudgetRequest;

  constructor() { }

  ngOnInit() {
  }

}
