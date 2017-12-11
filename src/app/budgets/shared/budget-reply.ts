import { Budget, MeasureUnit } from './budget';
import { BudgetRequest } from './budget-request';
import { Store } from './store';

export class BudgetReply implements Budget {
    id?: string;
    // budgetRequest?: BudgetRequest;
    availability?: boolean;
    measureUnit: MeasureUnit;
    quantity: string;
    store: Store;
    unitPrice?: number;
    totalPrice?: number;
    colors?: string;
    note?: string;
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
        // bReply.budget = budget;
        bReply.repliedAt = repliedAt;

        return bReply;
    }
}