import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mbp-client',
  template: `
    <mb-layout>
      <router-outlet id="clientsRouter"></router-outlet>
    </mb-layout>
  `
})
export class ClientComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
