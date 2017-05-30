import { BankAccount } from './../../billing/shared/bank-account';
import { ProposalStatus } from './proposal-status.enum';
import { TimeUnity } from '../../shared/time-unity.enum';
import { Delivery } from './delivery';

export class Proposal {
    id?: string;
    intro?: string;
    professionalsIds?: string[];
    private _cost?: number;
    costToReceive?: number;
    costToClient?: number;
    costFinal?: number;
    wasPaid: boolean;
    status: ProposalStatus;
    comments?: string;
    deadlineCount: number;
    deadlineTimeUnity: TimeUnity;
    bankAccount: BankAccount;
    deliveries: Delivery[];
    url?: string;

    constructor(wasPaid: boolean, status: ProposalStatus, id?: string) {
        this.id = id;
        this.wasPaid = wasPaid;
        this.status = status;
    }

    static parse(proposalData: JSON): Proposal {
        let proposal: Proposal;

        return proposal;
    }

    get cost(): number {
        return this._cost;
    }

    set cost(cost: number) {
        if (cost) {
            cost = parseFloat(cost.toFixed(2));
        }

        this._cost = cost;
    }
}