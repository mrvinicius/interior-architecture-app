import { Component, Input, OnInit, AfterViewInit, Renderer } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { ClientsService } from '../../client/shared/clients.service';
import { Client } from '../../client/shared/client';

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
  private isNewClient: boolean;
  private newClient: Client;

  constructor(
    private projectService: ProjectsService,
    private route: ActivatedRoute,
    private renderer: Renderer,
    private clientsService: ClientsService
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

  updateClient(id: number): void {
    this.project.client = this.clients.find(client => client.id === id);
  }
}
