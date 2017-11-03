import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'abx-budgets',
  // TODO: Tornar independente do módulo layout
  template: `
    <abx-layout>
      <main class="layout-content">
        <abx-budget-requester></abx-budget-requester>
      </main>
    </abx-layout>
  `,
  styles: []
})
export class BudgetsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
