import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MzModalService, MzBaseModal } from "ng2-materialize";

import { NewProjectModalComponent } from './new-project-modal.component';
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
  // @ViewChild(NewProjectModalComponent)
  // private newProjectModal: NewProjectModalComponent;

  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    private modalService: MzModalService
  ) {
    projectsService.newProjectTitleDefined$.subscribe(projectTitle => this.initProject(projectTitle));
  }

  getProjects(): void {
    this.projectsService.getAll()
      .subscribe(
      (result: Project[]) => { this.projects = result }
      );
    // .then(projects => this.projectsService = projects);
  }


  ngOnInit() {
    this.getProjects();
  }

  private initProject(title: string) {
    let id = this.projectsService.addProject(title);
    this.redirectToProject(id, title);
  }

  private openNewProjectModal() {
    // let modal: NewProjectModalComponent;
    let modalRef = this.modalService.open(NewProjectModalComponent, { });

    // this.newProjectModal.
    // modalRef
    // modal.modalComponent.onClose();
    // modal.afterClosed().subscribe(result => {});
  }

  private redirectToProject(id: number, title?: string): void {
    this.router.navigate(['/projetos', id]);
  }
}
