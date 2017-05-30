export class Bank {
    id: number;
    name: string;
    fullName: string;
    
    constructor(id: number | string, name?: string, fullName?: string) {
        this.id = Number(id);
        if (name !== undefined) this.name = name;
        if (fullName !== undefined) this.fullName = fullName;
    }
}