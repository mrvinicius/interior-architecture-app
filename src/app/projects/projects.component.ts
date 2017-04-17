import { Component, OnInit } from '@angular/core';

import { ProjectsService } from './shared/projects.service';

@Component({
  selector: 'mbp-projects',
  // Change to module-level when create Supplier or Client features
  providers: [ProjectsService],
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
