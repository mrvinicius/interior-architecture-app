import { Product } from './product';

type BudgetStatus = 'Waiting' | 'Budgeted';

export class Budget {
    id: string;
    supplier: string;
    subsidiaries?: string[];
    product: Product;
    status: BudgetStatus;

    constructor(
        supplier: string,
        product: Product,
        status: BudgetStatus
    ) {
        this.supplier = supplier;
        this.product = product;
        this.status = status;
    }
}
