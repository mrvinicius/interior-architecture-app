import { Component, OnInit } from '@angular/core';

@Component({
  template: `
    <h2>hi from projects root component</h2>
    <router-outlet id="projectsCmpRouter"></router-outlet>
  `,
})
export class ProjectsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
