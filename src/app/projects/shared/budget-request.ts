import { Budget, QuantityUnity } from './budget';
import { Product } from './product';
import { Store } from './store';
import { Supplier } from './supplier';

type BudgetStatus = 'Waiting' | 'Budgeted' | 'All_Budgeted';

export class BudgetRequest {
    id: string;

    supplier: Supplier;

    product: Product;

    quantityUnity: QuantityUnity;
    quantity: string | number;
    color?: string;
    note?: string;

    replies?: Budget[];

    status: BudgetStatus;

    constructor(
        supplier: Supplier,
        product: Product,
        quantityUnity: QuantityUnity,
        quantity: string | number,
        status: BudgetStatus = 'Waiting'
    ) {
        this.supplier = supplier;
        this.product = product;
        this.status = status;
        this.quantityUnity = quantityUnity;
        this.quantity = quantity;
    }
}
