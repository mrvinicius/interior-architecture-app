import { Store } from '../shared/store';

export class Supplier {
    id: string;
    name: string;
    stores?: Store[];

    constructor(name: string) {
        this.name = name;
    }
}
