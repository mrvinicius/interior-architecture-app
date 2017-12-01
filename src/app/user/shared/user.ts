export class User {
    id?: string;
    email: string;
    name: string;
    lastname?: string

    constructor(name?: string, email?: string, id?: string) {
        this.name = name;
        this.email = email;
        this.id = id;
    }
}
