import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BudgetService {
  private readonly baseUrl = 'https://archaboxapi.azurewebsites.net/api/orcamento';

  constructor() { }

  sendRequest(budget): Observable<any> {
    return Observable.of();
  }
}

