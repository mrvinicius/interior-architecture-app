import { Budget, MeasureUnit } from './budget';
import { BudgetReply } from './budget-reply';
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
    replies: BudgetReply[];
    status: BudgetStatus;

    constructor(
        supplier: Supplier,
        product: Product,
        measureUnit: MeasureUnit,
        quantity: string | number
    ) {
        this.supplier = supplier;
        this.product = product;
        this.measureUnit = measureUnit;
        this.quantity = quantity;
        this.status = 'Waiting';
    }

    static fromJson({ id, supplier, product, measureUnit, quantity, color, note, replies, status }): BudgetRequest {
        let bReq = new BudgetRequest(supplier, product, measureUnit, quantity);
        bReq.id = id;
        bReq.color = color;
        bReq.note = note;
        bReq.replies = replies;
        bReq.status = status;

        return bReq;
    }

    static fromJsonList(array): BudgetRequest[] {
        return array.map(BudgetRequest.fromJson);
    }
}
