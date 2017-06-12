import { User } from '../../core/user';

export class Client extends User {
    isActive?: boolean;

    constructor(name?: string, email?: string, id?: string) {
        super(name, email, id);
    }
}
