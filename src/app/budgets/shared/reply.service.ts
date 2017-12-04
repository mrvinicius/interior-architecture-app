import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { BudgetReply } from './budget-reply';

@Injectable()
export class ReplyService {
  private readonly baseUrl = 'http://localhost:8000/api/reply';

  constructor(private http: HttpClient) { }

  replyBudgetRequest(budgetReply: BudgetReply) {
    let putData = budgetReply;
    return this.http
      .post(`${this.baseUrl}/${budgetReply.id}`,
      putData,
      {
        headers: this.getHeaders()
      })
      .map(data => data)
      .catch(this.handleError);
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();

    headers.set('Authorization', 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==');
    headers.set('Content-Type', 'application/json');
    headers.set('Access-Control-Allow-Origin', '*');

    return headers;
  }

  private handleError(error: HttpErrorResponse) {
    let errMsg: string;
    if (error.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }

    return Observable.throw(error)
  }

}
