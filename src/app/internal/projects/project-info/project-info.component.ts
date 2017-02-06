import { Component, Input, OnInit, AfterViewInit, Renderer, ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { Client } from '../../client/shared/client';
import { Professional } from '../../professional/shared/professional';

import { ClientsService } from '../../client/shared/clients.service';

import { NewProPartnerDialogComponent } from './new-pro-partner-dialog.component';


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
  clients: Client[];
  currentProfessional: Professional;
  dialogRef: MdDialogRef<any>;

  @Input() project: Project;

  private isNewClient: boolean;
  private newClient: Client;

  constructor(
    private projectService: ProjectsService,
    private route: ActivatedRoute,
    private renderer: Renderer,
    private clientsService: ClientsService,
    private mdDialog: MdDialog,
    private viewContainerRef: ViewContainerRef
  ) { }

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
    if (localStorage.getItem('currentUser')) {
      this.currentProfessional = JSON.parse(localStorage.getItem('currentUser')) as Professional;
    }

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

  updateClient(id: number): void {
    this.project.client = this.clients.find(client => client.id === id);
  }
}
