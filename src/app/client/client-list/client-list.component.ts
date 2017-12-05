import { Component, OnInit, OnDestroy } from '@angular/core';
import { MzModalService } from 'ng2-materialize';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../core/auth.service';
import { Client } from '../shared/client';
import { ClientModalComponent } from '../client-modal/client-modal.component';
import { ClientService } from '../shared/client.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit, OnDestroy {
  allClientsChangeSubscription: Subscription;
  clients: Client[];
  clientAddedSubscription: Subscription;
  modalDismissedSubscription: Subscription;
  selectedClient: Client;

  constructor(
    private auth: AuthService,
    private clientService: ClientService,
    private modalService: MzModalService
  ) {
    // let c = new Client(), c1 = new Client();
    // c.id = "rh56y453654q65ad4w654e6f4waf";
    // c.name = "Suzane Kraig";
    // c.email = "suzane@test.com";
    // c.gender = "F";
    // c.cpfCnpj = "25.654.549/0001-10";
    // c.isActive = true;

    // c1.id = "5542223654q6544d4w652";
    // c1.name = "Sergio Cavalcante";
    // c1.email = "sergio@test.com";
    // c1.gender = "M";
    // c1.cpfCnpj = "16.254.994/0001-10";
    // c1.isActive = true;

    // this.clientService.allClients = [];
    // this.clientService.allClients.push(c);
    // this.clientService.allClients.push(c1);
  }

  addClient() {
    if (this.clients === undefined) this.clients = [];
    let c = new Client();
    c.isActive = true;

    this.clients.push(c);
  }

  disableClient(clientId: string) {
    this.clientService.disableClient(clientId, this.auth.getCurrentUser().id)
      .subscribe(response => {

      });
  }

  ngOnInit() {
    this.clientService.getAllByProfessional(this.auth.getCurrentUser().id, 999)
      .subscribe(clients => {
        clients = clients.filter(c => c.isActive);

        this.clients = clients && clients.length ? clients : []
      })

    this.allClientsChangeSubscription =
      this.clientService.allClientsChange$.subscribe(clients => {
        clients = clients.filter(c => c.isActive);
        this.clients = clients && clients.length ? clients : []
      })
  }

  ngOnDestroy() {
    this.allClientsChangeSubscription.unsubscribe();
    if (this.modalDismissedSubscription && !this.modalDismissedSubscription.closed)
      this.modalDismissedSubscription.unsubscribe()
  }

  onEditorClosed() {
    this.selectedClient = undefined;
  }

  onSelect(client: Client) {
    this.selectedClient = client;
  }

  openClientModal() {
    let modalRef = this.modalService.open(ClientModalComponent, {});
  }

  updateClientList(client) {
    let clientIndex = this.clients.findIndex(c => c.id === client.id);
    this.clients[clientIndex] = client;

  }
}
