import { User } from '../../core/user';

export class Client extends User {
    cpfCnpj: string;


    constructor(name?: string, email?: string, id?: string) {
        super(name, email, id);
    }
}
