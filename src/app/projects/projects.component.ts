import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mbp-projects',
  template: `
    <mb-layout>
      <router-outlet id="projectsRouter"></router-outlet>
    </mb-layout>
  `
})
export class ProjectsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
