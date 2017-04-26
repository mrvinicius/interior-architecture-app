export class User {
    id?: string;
    // token?: string; // TODO: Será?
    name: string;
    email: string;
    password?: string;
    
    constructor(name?: string, email?: string, id?: string) {
        this.name = name;
        this.email = email;
        this.id = id;
    }
}