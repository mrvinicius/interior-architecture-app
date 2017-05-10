import { ServiceType } from './service-type';

export class Service {
    id?: number;
    serviceType?: ServiceType;
    description?: string;
    deadline?: Date;
    cost?: number;
    paymentDeadline?: Date;
    subServices?: string[];
}
