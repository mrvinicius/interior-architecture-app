import { BudgetReply } from '../../budgets/shared/budget-reply';
import { MeasureUnit } from '../../budgets/shared/budget';
import { Product } from '../../budgets/shared/product';

import { Supplier } from './supplier';

type BudgetStatus = 'Waiting' | 'Budgeted' | 'All_Budgeted';

export interface BudgetRequest {
    id: string;
    supplier: Supplier;
    measureUnit: MeasureUnit;
    quantity: string | number;
    color?: string;
    note?: string;
    budgetReplies: BudgetReply[];
    status: BudgetStatus;
    product: Product;
    sender: {
        id: string,
        name: string,
        email: string
    };

}