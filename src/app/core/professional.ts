import { Client } from '../client/shared/client';
import { User } from './user';

export class Professional extends User {
    description?: string;
    logo?;
    cpfCnpj?: string;
    celular?: string;
    professionId?: string;
    // partners?: Professional[] = [];
    clients?: Client[] = [];

    constructor(name?: string, email?: string, id?: string) {
        super(name, email, id);
    }

    addClient(client: Client): void {
        this.clients.push(client);
    }
}
