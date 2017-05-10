import { ProposalStatus } from './proposal-status.enum';
import { Estado } from '../../shared/estado.enum';

export class Proposal {
    id?: string;
    intro?: string;
    uf?: Estado;
    professionalsIds?: string[];
    cost?: number;
    wasPaid: boolean;
    status: ProposalStatus;

    constructor(wasPaid: boolean, status: ProposalStatus, id?: string) {
        this.id = id;
        this.wasPaid = wasPaid;
        this.status = status;
    }
}