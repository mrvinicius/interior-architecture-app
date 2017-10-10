import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Budget } from './budget';
import { BudgetRequest } from './budget-request';

@Injectable()
export class BudgetService {
  private readonly baseUrl = 'https://archaboxapi.azurewebsites.net/api/orcamento';
  private replies: Budget[] = [
    {
      store: { name: 'Água Rasa', email: 'agrasa@loja.com' },      
      quantityUnity: 'peso',
      quantity: 22.3,
      unitPrice: undefined,
      totalPrice: undefined,
      color: 'Preta',
      note: undefined,
      status: 'Waiting'
    },
    {
      store: { name: 'Tatuapé', email: 'tatu@loja.com' },
      quantityUnity: 'unidade',
      quantity: 2,
      unitPrice: 20,
      totalPrice: 40,
      color: 'Preta',
      note: 'Não possui taxa de frete',
      status: 'Budgeted'
    }
  ];

  constructor() { }

  sendRequest(request: BudgetRequest): Observable<any> {


    request.supplier.stores.forEach(store => {

    });

    return Observable.of();
  }

  getRequestReplies(requestId: string): Observable<Budget[]> {
    return Observable.of(this.replies)
  }
}
