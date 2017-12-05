import { Budget, MeasureUnit } from './budget';
import { BudgetReply } from './budget-reply';
import { Product } from './product';
import { Supplier } from './supplier';

type BudgetStatus = 'Waiting' | 'Budgeted' | 'All_Budgeted';

export class BudgetRequest {
    id: string;
    supplier: Supplier;
    measureUnit: MeasureUnit;
    quantity: string | number;
    color?: string;
    note?: string;
    budgetReplies: BudgetReply[];
    status: BudgetStatus;
    sender: {
        id: string,
        name: string,
        email: string
    };
    private _product: Product;

    private _isNewProduct: boolean;
    private _newProductName: string;

    get isNewProduct() {
        return this._isNewProduct;
    }

    set isNewProduct(x) { }

    get newProductName() {
        return this._newProductName;
    }

    set newProductName(productName: string) {
        this._newProductName = productName;

        if (productName) {
            this._isNewProduct = true;
        } else {
            this._isNewProduct = false;
        }
    }

    get product() {
        return this._product;
    }

    set product(product: Product) {
        this._isNewProduct = false;
        this._newProductName = null;
        this._product = product;
    }

    constructor(
        supplier: Supplier,
        measureUnit: MeasureUnit,
        quantity: string | number,
        product?: Product
    ) {
        this.supplier = supplier;
        this.measureUnit = measureUnit;
        this.quantity = quantity;
        this.product = product;
        this.status = 'Waiting';
    }

    static fromJson({
         id,
        supplier,
        product,
        measureUnit,
        quantity, color,
        note,
        budgetReplies,
        status }): BudgetRequest {
            
        let bReq = new BudgetRequest(supplier, measureUnit, quantity, product);
        bReq.id = id;
        bReq.color = color;
        bReq.note = note;
        bReq.budgetReplies = budgetReplies;
        bReq.status = status;

        return bReq;
    }

    static fromJsonList(array): BudgetRequest[] {
        return array.map(BudgetRequest.fromJson);
    }
}
