import { Budget } from './budget';
import { BudgetRequest } from './budget-request';
import { Store } from './store';

export class BudgetReply {
    id?: string;
    budget?: Budget;
    // budgetRequest?: BudgetRequest;
    store: Store;
    repliedAt?: Date;
    status: 'Waiting' | 'Budgeted';

    constructor(store: Store) {
        this.store = store;
        this.status = 'Waiting';
    }
}