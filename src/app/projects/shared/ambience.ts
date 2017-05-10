import { Service } from './service';

export class Ambience {
    id?: string;
    title?: string;
    ambianceType?: string;
    area?: number;
    services: Service[];
}
