import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'abx-billing',
    template: `
    <abx-layout>
      <router-outlet id="billingRouter"></router-outlet>
    </abx-layout>
  `
})
export class BillingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
