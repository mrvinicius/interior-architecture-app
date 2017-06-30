import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mbp-client',
  template: `
    <abx-layout>
      <router-outlet id="clientsRouter"></router-outlet>
    </abx-layout>
  `
})
export class ClientComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
