export class User {
    id?: string;
    name: string;
    lastname?: string;
    email: string;
    password?: string;
    cpfCnpj?: string;
    gender?: string;
    validated?: string; 
    
    constructor(name?: string, email?: string, id?: string) {
        this.name = name;
        this.email = email;
        this.id = id;
    }
}
