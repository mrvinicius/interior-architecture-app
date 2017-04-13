import { Component, OnInit } from '@angular/core';

@Component({
  template: `
    <router-outlet id="projectsCmpRouter"></router-outlet>
  `,
})
export class ProjectsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
