import { ProjectsService } from './shared/projects.service';
import { Component, OnInit } from '@angular/core';

import { ProfessionalService } from './../core/professional.service';
import { ProjectServicesService } from './shared/project-services.service';
import { AmbienceService } from './shared/ambience.service';

@Component({
  selector: 'mbp-projects',
  providers: [ProjectServicesService],
  template: `
    <mb-layout>
      <router-outlet id="projectsRouter"></router-outlet>
    </mb-layout>
  `
})
export class ProjectsComponent implements OnInit {

  constructor(
    // private clientsService: ClientService
    private profService: ProfessionalService,
    private projectsService: ProjectsService,
    private projectServService: ProjectServicesService,
  ) { }

  ngOnInit() { }

}
