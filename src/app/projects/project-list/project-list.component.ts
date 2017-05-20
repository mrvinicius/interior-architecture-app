import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MzModalService, MzBaseModal } from "ng2-materialize";
import { Subscription } from 'rxjs/Subscription';

import { Ambience } from './../shared/ambience';
import { AmbienceDescription } from './../shared/ambience-description.enum';
import { Proposal } from './../shared/proposal';
import { ProposalStatus } from './../shared/proposal-status.enum';
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
  ProjectStatus = ProjectStatus;
  allClientsChangeSubinscription: Subscription;
  newProjectTitleDefinedSubinscription: Subscription;

  constructor(
    private projectsService: ProjectsService,
    private clientService: ClientService,
    private router: Router,
    private modalService: MzModalService,
    private spinnerService: SpinnerService
  ) {
    /*
    * MOCK
    let prop = new Proposal(false, ProposalStatus.NotSent);
    let p = new Project(prop);
    p.title = 'Projeto MOCK'
    let amb1 = new Ambience(), amb2 = new Ambience();
    amb1.ambienceDescription = AmbienceDescription[AmbienceDescription[1]];
    amb1.area = 10;
    // amb1.services = ['0', '2']
    amb2.area = 22;
    p.client = new Client();
    p.ambiences = [amb1, amb2];

    this.projectsService.allProjects.push(p);

    */
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
    let sameNameProjects: Project[] = this.projectsService.allProjects.filter(project => {
      return UtilsService.slugify(title) === UtilsService.slugify(project.title);
    });

    if (sameNameProjects.length > 0) {
      title += ' (' + sameNameProjects.length + ')';
    }
    console.log(title);

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
