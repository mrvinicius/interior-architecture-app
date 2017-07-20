import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MzModalService, MzBaseModal } from "ng2-materialize";
import { Subject } from 'rxjs/Subject'; 
import { Subscription } from 'rxjs/Subscription';

import { Ambience } from '../shared/ambience';
import { AmbienceDescription } from '../shared/ambience-description.enum';
import { AuthService } from '../../core/auth.service';
import { Proposal } from '../shared/proposal';
import { ProposalStatus } from '../shared/proposal-status.enum';
import { SpinnerService } from '../../core/spinner/spinner.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { Client } from '../../client/shared/client';
import { ClientService } from '../../client/shared/client.service';
import { NewProjectModalComponent } from './new-project-modal.component';
import { Professional } from '../../core/professional';
import { ProfessionalService } from '../../core/professional.service';
import { Project } from '../shared/project';
import { ProjectsService } from '../shared/projects.service';
import { ProjectStatus } from '../shared/project-status.enum';

@Component({
  selector: 'abx-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  allProjectTitles: string[];
  projects: Project[];
  professional: Professional;
  clients: Client[];
  ProjectStatus = ProjectStatus;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private auth: AuthService,
    private clientService: ClientService,
    private projectsService: ProjectsService,
    private profService: ProfessionalService,
    private router: Router,
    private modalService: MzModalService,
    private spinnerService: SpinnerService
  ) {
    this.profService.getCurrentProfessional().subscribe(prof => this.professional = prof);

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
    this.projectsService.newProjectTitleDefined$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(projectTitle => this.beginProject(projectTitle));

    this.projectsService.newAtnProjectTitleDefined$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(projectTitle => this.beginProject(projectTitle, true));

    this.projectsService.getAllByProfessional(this.auth.getCurrentUser().id, 999)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(projects => {
        projects = projects.filter(p => p.isActive);
        this.projects = projects && projects.length ? projects : [];
        this.allProjectTitles = this.projects.map(p => p.title)
      });

    this.clientService.getAllByProfessional(this.auth.getCurrentUser().id, 999)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(clients => this.clients = clients ? clients : [])
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  openNewProjectModal() {
    let modalRef = this.modalService.open(NewProjectModalComponent, {});
  }

  private beginProject(title: string, atnProject?: boolean) {
    let sameNameProjects: Project[];
    let definitiveTitle = title;
    this.spinnerService.toggleLoadingIndicator(true);

    if (this.allProjectTitles && this.allProjectTitles.length) {
      this.allProjectTitles.forEach(t => {
        if (definitiveTitle === t) {
          definitiveTitle = t + ' (1)';
        }
      });
    }

    this.projectsService.add(definitiveTitle, atnProject)
      .subscribe((project: Project) => {
        this.projects.push(project);
        this.spinnerService.toggleLoadingIndicator(false);
        this.redirectToProject(project.title);
      });
  }

  private redirectToProject(title: string): void {
    this.router.navigate(['/projetos', UtilsService.slugify(title)]);
  }
}
