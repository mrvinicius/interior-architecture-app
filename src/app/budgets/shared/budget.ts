import { Store } from './store';

export type MeasureUnit = 'units' | 'kg' | 'measurement2d' | 'measurement3d' | 'liter';

export class Budget {
    // id: string;
    // store: Store;
    measureUnit: MeasureUnit;
    quantity: string | number;
    unitPrice?: number;
    totalPrice?: number;
    color?: string;
    note?: string;

    constructor() {

    }

    static fromJson({
        measureUnit,
        quantity,
        unitPrice,
        totalPrice,
        color,
        note }): Budget {

        let b = new Budget();
        b.measureUnit = measureUnit;
        b.quantity = quantity;
        b.unitPrice = unitPrice;
        b.totalPrice = totalPrice;
        b.color = color;
        b.note = note;

        return b;
    }
}
