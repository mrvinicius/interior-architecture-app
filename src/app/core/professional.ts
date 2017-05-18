import { Client } from '../client/shared/client';
import { User } from './user';
import { Profession } from '../shared/profession.enum';

export class Professional extends User {
    description?: string;
    logo?;
    cpfCnpj?: string;
    celular?: string;
    profession?: Profession;
    clients?: Client[];

    constructor(name?: string, email?: string, id?: string) {
        super(name, email, id);

        this.clients = [];
    }
}
