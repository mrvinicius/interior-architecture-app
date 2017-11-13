import { Budget, MeasureUnit } from './budget';
import { Product } from './product';
import { Store } from './store';
import { Supplier } from './supplier';

type BudgetStatus = 'Waiting' | 'Budgeted' | 'All_Budgeted';

export class BudgetRequest {
    id: string;

    supplier: Supplier;

    product: Product;

    measureUnit: MeasureUnit;
    quantity: string | number;
    color?: string;
    note?: string;

    replies?: Budget[];

    status: BudgetStatus;

    constructor(
        supplier: Supplier,
        product: Product,
        measureUnit: MeasureUnit,
        quantity: string | number,
        status: BudgetStatus = 'Waiting'
    ) {
        this.supplier = supplier;
        this.product = product;
        this.status = status;
        this.measureUnit = measureUnit;
        this.quantity = quantity;
    }

    static fromJson({ id, supplier, product, measureUnit, quantity, color, note, replies, status }): BudgetRequest {
        let bReq = new BudgetRequest(supplier, product, measureUnit, quantity, status);
        bReq.id = id;
        bReq.color = color;
        bReq.note = note;
        bReq.replies = replies;

        return bReq;
    }

    static fromJsonList(array): BudgetRequest[] {
        return array.map(BudgetRequest.fromJson);
    }
}
