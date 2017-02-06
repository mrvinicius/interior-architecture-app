import { Injectable } from '@angular/core';

import { Client } from './client';
import { CLIENTS } from './mock-client';

@Injectable()
export class ClientsService {

  constructor() { }

  insert(client: Client): number {
    let generatedId = 99;
    
    client.id = generatedId;
    CLIENTS.push(client);

    return generatedId;
  }

  getAll(): Promise<Client[]> {
    let clients: Client[] = CLIENTS;

    return Promise.resolve(clients);
  }

}
