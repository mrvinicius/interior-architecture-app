import { Component, OnInit } from '@angular/core';

import { Project } from './../shared/project';
import { ProjectsService } from './../shared/projects.service';
import { ProjectStatus } from '../shared/project-status.enum';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: Project[];
  ProjectStatus = ProjectStatus;

  constructor(
    private projectsService: ProjectsService
  ) { }

  getProjects(): void {
    this.projectsService.getAll()
    .subscribe(
      (result: Project[]) => {this.projects = result}
    );
      // .then(projects => this.projectsService = projects);
  }

  ngOnInit() {
    this.getProjects();
  }

}
