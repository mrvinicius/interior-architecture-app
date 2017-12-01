import { DataSource } from '@angular/cdk/collections';

import { Observable } from 'rxjs/Observable';

import { BudgetReply } from './budget-reply';

export interface ReplyData {
    storeName: string,
    quantity: string | number,
    unitPrice: number,
    totalPrice: number,
    color: string,
    note: string
}

export const displayedColumns = [
    'storeName',
    'quantity',
    'unitPrice',
    'totalPrice',
    'color',
    'note'
];

export class ReplyDataSource extends DataSource<any> {

    constructor(public replies: BudgetReply[]) {
        super();
    }

    connect(): Observable<ReplyData[]> {
        return Observable.of(
            this.replies.map(reply => {
                return {
                    storeName: reply.store.name,
                    quantity: reply.budget ? reply.budget.quantity : '',
                    unitPrice: reply.budget ? reply.budget.unitPrice : 0,
                    totalPrice: reply.budget ? reply.budget.totalPrice : 0,
                    color: reply.budget ? reply.budget.color : '',
                    note: reply.budget ? reply.budget.note : ''
                }
            })
        );
    }

    disconnect() { }
}