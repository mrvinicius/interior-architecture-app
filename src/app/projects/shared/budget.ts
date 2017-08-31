import { Product } from './product';
import { Supplier } from './supplier';

type BudgetStatus = 'Waiting' | 'Budgeted';

export class Budget {
    id: string;
    supplier: Supplier;
    subsidiaries?: {
        id?: string,
        name?: string,
        email: string,
        tel?: string
    }[];
    product: Product;
    status: BudgetStatus;

    constructor(
        supplier: Supplier,
        product: Product,
        status: BudgetStatus
    ) {
        this.supplier = supplier;
        this.product = product;
        this.status = status;
    }
}
