import { BudgetRequest } from './budget-request';
import { Store } from './store';

     type MeasureUnit = 'units' | 'kg' | 'measurement2d' | 'measurement3d' | 'liter';

export class BudgetReply {
    id?: string;
    // budgetRequest?: BudgetRequest;
    availability?: boolean;
    measureUnit: MeasureUnit;
    quantity: string;
    store: Store;
    unitPrice?: number;
    totalPrice?: number;
    colors?: string;
    productCode?: string;
    note?: string;
    status: 'Waiting' | 'Budgeted';
    repliedAt?: Date;

}