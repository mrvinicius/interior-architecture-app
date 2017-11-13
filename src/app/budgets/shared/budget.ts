import { Store } from './store';

export type MeasureUnit = 'units' | 'kg' | 'measurement2d' | 'measurement3d';

export class Budget {
    id: string;
    store: Store;
    measureUnit: MeasureUnit;
    quantity: string | number;
    unitPrice?: number;
    totalPrice?: number;
    color?: string;
    note?: string;
    status: 'Waiting' | 'Budgeted';

    constructor() {
        
    }
}
