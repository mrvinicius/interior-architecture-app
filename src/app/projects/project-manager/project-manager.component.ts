import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Project } from './../shared/project';
import { ProjectsService } from './../shared/projects.service';

@Component({
  selector: 'app-project-manager',
  templateUrl: './project-manager.component.html',
  styleUrls: ['./project-manager.component.scss']
})
export class ProjectManagerComponent implements OnInit {
  project: Project;
  
  constructor(
    private activateRoute: ActivatedRoute,
    private projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this.activateRoute.params
      .switchMap((params: Params) => this.projectsService.getProject(+params['id']))
      .subscribe(project => this.project = project);
  }


}
