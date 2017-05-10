import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MzModalService, MzBaseModal } from "ng2-materialize";
import { Subscription } from 'rxjs/Subscription';

import { SpinnerService } from '../../core/spinner/spinner.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { Client } from '../../client/shared/client';
import { ClientService } from '../../client/shared/client.service';
import { NewProjectModalComponent } from './new-project-modal.component';
import { Project } from '../shared/project';
import { ProjectsService } from '../shared/projects.service';
import { ProjectStatus } from '../shared/project-status.enum';

@Component({
  selector: 'mbp-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[];
  ProjectStatus = ProjectStatus;
  // @ViewChild(NewProjectModalComponent)
  // private newProjectModal: NewProjectModalComponent;
  allClientsChangeSubinscription: Subscription;
  newProjectTitleDefinedSubinscription: Subscription;

  constructor(
    private projectsService: ProjectsService,
    private clientService: ClientService,
    private router: Router,
    private modalService: MzModalService,
    private spinnerService: SpinnerService
  ) {
    
  }

  disableProject(id: string) {
    this.projectsService.disableProject(id).subscribe(response => {
      console.log(response);
      
    });
  }

  getClientName(id: string): string {
    return this.getClients().find((client: Client) => {
      return client.id === id
    }).name;
  }

  getClients() {
    return this.clientService.allClients;
  }

  getProjects() {
    return this.projectsService.allProjects;
  }

  ngOnInit() {
    this.newProjectTitleDefinedSubinscription =
      this.projectsService.newProjectTitleDefined$
        .subscribe(projectTitle => { this.beginProject(projectTitle) });
  }

  ngOnDestroy() {
    this.newProjectTitleDefinedSubinscription.unsubscribe();
  }

  openNewProjectModal() {
    let modalRef = this.modalService.open(NewProjectModalComponent, {});
  }

  private beginProject(title: string) {
    this.spinnerService.toggleLoadingIndicator(true);
    this.projectsService.add(title).subscribe((project: Project) => {
      this.spinnerService.toggleLoadingIndicator(false);
      this.redirectToProject(project.title);
    });
  }

  // private initProject(title: string) {
  //   this.projectsService.add(title).subscribe((project: Project) => {
  //     this.redirectToProject(project.id);
  //   });
  // }

  private redirectToProject(title: string): void {
    this.router.navigate(['/projetos', UtilsService.slugify(title)]);
  }
}
