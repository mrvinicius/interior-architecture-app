export class ServiceType {
    id: string;
    type: string;
    typeDescription: string;

    constructor(id?: string, type?: string, typeDescription?: string) {
        this.id = id;
        this.type = type;
        this.typeDescription = typeDescription;
    }
}
