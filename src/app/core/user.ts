export class User {
    id?: string;
    name: string;
    lastName?: string;
    email: string;
    password?: string;
    cpfCnpj?: string;
    gender?: string;
    
    constructor(name?: string, email?: string, id?: string) {
        this.name = name;
        this.email = email;
        this.id = id;
    }
}