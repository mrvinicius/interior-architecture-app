import { Budget } from './budget';
import { BudgetRequest } from './budget-request';
import { Store } from './store';

export class BudgetReply {
    id?: string;
    budget?: Budget;
    // budgetRequest?: BudgetRequest;
    store: Store;
    status: 'Waiting' | 'Budgeted';
    repliedAt?: Date;

    constructor(store: Store, status: string = 'Waiting') {
        this.store = store;
        this.status = 'Waiting';
    }

    static fromJson({ id, budget, store, status, repliedAt })
        : BudgetReply {
        let bReply = new BudgetReply(store, status);
        bReply.id = id;
        bReply.budget = budget;
        bReply.repliedAt = repliedAt;

        return bReply;
    }
}