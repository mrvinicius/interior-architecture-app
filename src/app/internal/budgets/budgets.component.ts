import { Component, OnInit } from '@angular/core';

@Component({
  template: `
    <h1>Budgets Work!</h1>
    <router-outlet id="budgetsCmpRouter"></router-outlet>
  `,
})
export class BudgetsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
