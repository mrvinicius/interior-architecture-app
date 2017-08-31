export class Supplier {
    id: string;
    name: string;
    // email: string;
    subsidiaries?: {
        id?: string,
        name?: string,
        email: string,
        tel?: string
    }[];

    constructor(name: string, email: string) {
        this.name = name;
        // this.email = email;
    }
}
