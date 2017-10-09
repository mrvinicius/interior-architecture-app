import { Product } from './product';
import { Supplier } from './supplier';

type BudgetStatus = 'Waiting' | 'Budgeted' | 'All_Budgeted';
type QuantityUnity = 'unidade' | 'peso' | 'medida2d' | 'medida3d';

export class Budget {
    id: string;
    
    supplier: Supplier;

    product: Product;

    quantityUnity: QuantityUnity;
	quantity: string | number;
	color?: string;
    note?: string;
    
    replies?: string;
        
    status: BudgetStatus;

    constructor(
        supplier: Supplier,
        product: Product,
		quantityUnity: QuantityUnity,
		quantity: string | number,
        status: BudgetStatus
    ) {
        this.supplier = supplier;
        this.product = product;
        this.status = status;
        this.quantityUnity = quantityUnity;
		this.quantity = quantity;
    }
}
