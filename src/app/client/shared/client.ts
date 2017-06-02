import { User } from '../../core/user';

export class Client extends User {

    constructor(name?: string, email?: string, id?: string) {
        super(name, email, id);
    }
}
