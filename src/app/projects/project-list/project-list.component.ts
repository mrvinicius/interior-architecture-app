import { AuthService } from './../../core/auth.service';
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
import { ProfessionalService } from './../../core/professional.service';
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
  clients: Client[];
  ProjectStatus = ProjectStatus;
  allClientsChangeSubinscription: Subscription;
  newProjectTitleDefinedSubinscription: Subscription;

  constructor(
    private auth: AuthService,
    private clientService: ClientService,
    private projectsService: ProjectsService,
    private profService: ProfessionalService,
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
    let client = this.clients.find((client: Client) => {
      return client.id === id
    });

    if (client !== undefined)
      return client.name;

    return '';
  }

  ngOnInit() {
    
    this.newProjectTitleDefinedSubinscription =
      this.projectsService.newProjectTitleDefined$
        .subscribe(projectTitle => this.beginProject(projectTitle));

    this.projectsService.getAllByProfessional(this.auth.getCurrentUser().id, 999)
      .subscribe(projects => {        
        
        this.projects = projects ? projects.filter(project => project.isActive) : []
        console.log(this.projects);
      });

    this.clientService.getAllByProfessional(this.auth.getCurrentUser().id, 999)
      .subscribe(clients => this.clients = clients ? clients : [])
  }

  ngOnDestroy() {
    this.newProjectTitleDefinedSubinscription.unsubscribe();
  }

  openNewProjectModal() {
    let modalRef = this.modalService.open(NewProjectModalComponent, {});
  }


  private beginProject(title: string) {
    this.spinnerService.toggleLoadingIndicator(true);
    let sameNameProjects: Project[];

    if (this.projects && this.projects.length) {
      sameNameProjects = this.projects.filter(project => {
        console.log(project);
        return UtilsService.slugify(title) === UtilsService.slugify(project.title);

      });
    }

    if (sameNameProjects && sameNameProjects.length > 0) {
      title += ' (' + sameNameProjects.length + ')';
    }

    console.log(title);

    this.projectsService.add(title).subscribe((project: Project) => {
      console.log('RespProject: ', project);
      this.projects.push(project);
      
      this.spinnerService.toggleLoadingIndicator(false);
      this.redirectToProject(project.title);
    });


  }

  private redirectToProject(title: string): void {
    this.router.navigate(['/projetos', UtilsService.slugify(title)]);
  }
}
