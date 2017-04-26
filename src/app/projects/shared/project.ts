import { Service } from './service';
import { Professional } from '../../core/professional';
import { ProjectStatus } from './project-status.enum';
import { Client } from '../../client/shared/client';

export class Project {
    id?: string;
    title: string;
    briefing?: string;
    client?: Client;
    professional: Professional;
    partnersIds?: string[];
    wasPaid?: boolean;
    status?: ProjectStatus;
    received?: number;
    services?: Service[];
}
