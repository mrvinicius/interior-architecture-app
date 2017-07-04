import { Component, OnInit } from '@angular/core';

import { AmbienceService } from './shared/ambience.service';
import { ProfessionalService } from './../core/professional.service';
import { ProjectsService } from './shared/projects.service';
import { ProjectServicesService } from './shared/project-services.service';

@Component({
  // selector: 'abx-projects',
  providers: [ProjectServicesService],
  template: `
      <router-outlet id="projectsRouter"></router-outlet>
  `
})
export class ProjectsComponent {

  constructor(
    private profService: ProfessionalService,
    private projectsService: ProjectsService,
    private projectServService: ProjectServicesService,
  ) { }
}
