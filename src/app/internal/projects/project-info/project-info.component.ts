import { Component, Input, OnInit, AfterViewInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';


import { Client } from '../../client/shared/client';
import { ClientsService } from '../../client/shared/clients.service';
import { NewProPartnerDialogComponent } from './new-pro-partner-dialog.component';
import { Professional } from '../../professional/shared/professional';
import { ServiceType, serviceTypesDesc } from '../shared/service-type.enum';
import { UserService } from '../../../core/user/shared/user.service';
import { Service } from '../shared/service';

import {
  Project,
  ProjectsService
} from '../shared';

@Component({
  selector: 'project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent implements OnInit, AfterViewInit {
  @Input() project: Project;
  clients: Client[];
  currentProfessional: Professional;
  dialogRef: MdDialogRef<any>;
  hasNewService: boolean = false;
  ServiceType = ServiceType;
  serviceTypesDesc = serviceTypesDesc;
  @ViewChild('serviceDescInput') serviceDescInput;

  private isNewClient: boolean;
  private newClient: Client;

  constructor(
    private projectService: ProjectsService,
    private route: ActivatedRoute,
    private renderer: Renderer,
    private clientsService: ClientsService,
    private mdDialog: MdDialog,
    private viewContainerRef: ViewContainerRef,
    private userService: UserService
  ) {
    // console.log(serviceTypesDesc[ServiceType[ServiceType.Tipo1]]);
  }

  addService() {
    if (!this.project.services)
      this.project.services = [];

    if (this.project.services[this.project.services.length - 1].id) {
      this.hasNewService = true;

      this.project.services.push({
        description: 'Novo serviço...'
      });
    }
  }

  getClients() {
    this.clientsService.getAll().then(clients => this.clients = clients);
  }

  newClientToggle(isNewClient: boolean): void {
    this.isNewClient = isNewClient;
  }

  ngAfterViewInit(): void {
    if (this.project && !this.project.client)
      this.isNewClient = true;
  }

  ngOnInit(): void {
    this.currentProfessional = this.userService.getCurrentUser();

    this.route.params
      .switchMap((params: Params) => this.projectService.getProject(+params['id']))
      .subscribe(project => this.project = project);

    this.getClients();

    this.newClient = new Client();
  }

  saveProject(): void {
    if (this.isNewClient) {
      let id = this.clientsService.insert(this.newClient);
      this.newClient.id = id
      this.project.client = this.newClient;
      console.log(this.project)
      console.log(this.newClient);
    }


  }

  showNewProfessionalDialog() {
    let dialogConfig = new MdDialogConfig();
    dialogConfig.viewContainerRef = this.viewContainerRef;

    this.dialogRef = this.mdDialog.open(NewProPartnerDialogComponent, dialogConfig);
    this.dialogRef.componentInstance.param1 = "Test"
    this.dialogRef.afterClosed().subscribe(professional => {
      // if (professional)
      //     this.beginNewProject(result);
    });
  }

  suggestDefaultDesc(service: Service, serviceType: ServiceType, input) {
    let defaultDescription;
    switch (serviceType) {
      case ServiceType.Tipo1:
        defaultDescription = serviceTypesDesc[ServiceType[ServiceType.Tipo1]].defaultDescription;
        break;
      case ServiceType.Tipo2:
        defaultDescription = serviceTypesDesc[ServiceType[ServiceType.Tipo2]].defaultDescription;
        break;
      default:
        break;
    }
    
    this.serviceDescInput.value = defaultDescription;
  }

  updateClient(id: number): void {
    this.project.client = this.clients.find(client => client.id === id);
  }
}
