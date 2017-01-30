import { Component, OnInit } from '@angular/core';

@Component({
  template: `
    <router-outlet id="internalCmpRouter"></router-outlet>
  `,
})
export class InternalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
