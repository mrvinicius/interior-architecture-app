import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { Project } from '../shared/project';

import { ProjectsService } from '../shared/projects.service';


@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  project: Project;

  constructor(
    private projectService: ProjectsService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params
    .switchMap((params: Params) => this.projectService.getProject(+params['id']))
    .subscribe(project => this.project = project);
  }

}
