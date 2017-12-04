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
    'unitPrice',
    'totalPrice',
    'color',
    'note'
];

export class ReplyDataSource extends DataSource<any> {

    constructor(public replies: BudgetReply[]) {
        super();
        console.log(replies)
    }

    connect(): Observable<ReplyData[]> {
        return Observable.of(
            this.replies.map(reply => {
                let data = {
                    storeName: reply.store.name,
                    quantity: reply ? reply.quantity : '',
                    unitPrice: reply ? reply.unitPrice : 0,
                    totalPrice: reply ? reply.totalPrice : 0,

                    // TODO: Resolver o nome da coluna no BACK-END
                    color: reply ? (<any>reply).color : '',
                    note: reply ? reply.note : ''
                }
                
                return data;
            })
        );
    }

    disconnect() { }
}