import { Store } from './store';

export type QuantityUnity = 'unidade' | 'peso' | 'medida2d' | 'medida3d';

export class Budget {
    store: Store;
    quantityUnity: QuantityUnity;
    quantity: string | number;
    unitPrice?: number;
    totalPrice?: number;
    color?: string;
    note?: string;
    status: 'Waiting' | 'Budgeted';

    constructor() {
        
    }
}
