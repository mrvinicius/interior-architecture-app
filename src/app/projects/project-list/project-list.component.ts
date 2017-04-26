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
      .subscribe((result: Project[]) => {
        this.projects = result
      });
  }


  ngOnInit() {
    this.getProjects();
  }

  openNewProjectModal() {
    // let modal: NewProjectModalComponent;
    let modalRef = this.modalService.open(NewProjectModalComponent, {});

    // this.newProjectModal.
    // modalRef
    // modal.modalComponent.onClose();
    // modal.afterClosed().subscribe(result => {});
  }

  private initProject(title: string) {
    this.projectsService.add(title).subscribe((project: Project) => {
      // this.redirectToProject(project.id); // TODO: Resolver problema de adição de projetos 
    });
  }

  private redirectToProject(id: string, title?: string): void {
    this.router.navigate(['/projetos', id]);
  }
}
