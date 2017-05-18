import { ProposalStatus } from './proposal-status.enum';
import { TimeUnity } from '../../shared/time-unity.enum';

export class Proposal {
    id?: string;
    intro?: string;
    professionalsIds?: string[];
    cost?: number;
    costToReceive?: number;
    costToClient?: number;
    costFinal?: number;
    wasPaid: boolean;
    status: ProposalStatus;
    comments?: string;
    deadlineCount: number;
    deadlineTimeUnity: TimeUnity;

    constructor(wasPaid: boolean, status: ProposalStatus, id?: string) {
        this.id = id;
        this.wasPaid = wasPaid;
        this.status = status;
    }

    static parse(proposalData: JSON): Proposal {
        let proposal: Proposal;

        return proposal;
    }
}