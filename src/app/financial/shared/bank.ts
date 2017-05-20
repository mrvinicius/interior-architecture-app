export class Bank {
    id: number;
    name: string;
    fullName: string;
    
    constructor(id: number | string, name: string, fullName: string) {
        this.id = Number(id);
        this.name = name;
        this.fullName = fullName;
    }
}