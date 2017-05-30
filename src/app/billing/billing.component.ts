import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'abx-billing',
    template: `
    <mb-layout>
      <router-outlet id="billingRouter"></router-outlet>
    </mb-layout>
  `
})
export class BillingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
