import { Service } from './service';
import { ServicesGroup } from './services-group.enum';

export class Ambience {
    id: string;
    description?: string;
    // ambianceType?: string;
    area?: number;
    servicesGroup?: ServicesGroup;
    isActive: boolean;
    services: Service[];
    cost?: number;
    comments?: string;

    constructor(id?: string, title?: string) {
        this.id = id;
        this.description = title;
        
        // this.services = [];
        this.isActive = true;
    }
}
