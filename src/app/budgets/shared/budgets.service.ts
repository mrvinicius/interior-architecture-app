import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Budget } from './budget';
import { BudgetRequest } from './budget-request';
import { BudgetReply } from './budget-reply';
import { Product } from './product';

@Injectable()
export class BudgetsService {
  private readonly baseUrl = 'http://localhost:8000/api/budget';
  private budgetRequests: BudgetRequest[] = [];

  constructor(private http: HttpClient) { }

  disableRequest(id): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/disable`,
      { id: id },
      {
        headers: this.getHeaders()
        // withCredentials: true
      })
      .map(data => data)
      .catch(this.handleError);
  }

  enableRequest(id): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/enable`,
      { id: id },
      {
        headers: this.getHeaders()
      })
      .map(data => data)
      .catch(this.handleError);
  }

  getAll(userId, syncBackend?: boolean): Observable<BudgetRequest[]> {
    if (syncBackend) {
      return this.http.get<BudgetRequest[]>(`${this.baseUrl}/getAll?userId=${userId}`, {
        headers: this.getHeaders(),
        observe: 'body',
        responseType: 'json',
        // withCredentials: true
      }).map(budgetReqData => {
        let handledData = budgetReqData.map(req => {
          req['supplier'] = (<any>req.product).supplier;
          return req
        })

        this.budgetRequests = handledData;
        return handledData;
      }).catch(this.handleError)
    }

    return Observable.of(this.budgetRequests);
  }

  getByReply(replyId): Observable<BudgetRequest> {
    return this.http
      .get<BudgetRequest>(`${this.baseUrl}/getByReply/${replyId}`, {
        headers: this.getHeaders(),
        observe: 'body',
        responseType: 'json',
        // withCredentials: true
      })
      .map(requestData => requestData)
      .catch(this.handleError);
  }

  replyBudgetRequest(budgetReply: BudgetReply) {
    let putData;
    return this.http
      .put(`${this.baseUrl}/reply/${budgetReply.id}`,
      putData,
      {
        headers: this.getHeaders()
      })
      .map(data => data)
      .catch(this.handleError);
  }

  sendBudgetRequest(budgetReq: BudgetRequest, userId): Observable<BudgetRequest> {
    let postData = {
      userId: userId,
      supplierId: budgetReq.supplier.id,
      storeIds: budgetReq.budgetReplies.map(reply => reply.store.id),
      isNewProduct: budgetReq.isNewProduct,
      product: {
        id: budgetReq.isNewProduct ? '' : budgetReq.product.id,
        name: budgetReq.isNewProduct ? budgetReq.newProductName : budgetReq.product.name
      },
      measureUnit: budgetReq.measureUnit,
      quantity: budgetReq.quantity,
      color: budgetReq.color,
      note: budgetReq.note
    };

    if (!this.budgetRequests) {
      this.budgetRequests = []
    }

    // this.budgetRequests.push(budgetReq);

    // return Observable.of(budgetReq)

    return this.http.post<{ budgetRequest, product, budgetReplies }>(`${this.baseUrl}/sendRequest`, postData, {
      headers: this.getHeaders(),
      observe: 'body',
      responseType: 'json',
      // withCredentials: true
    }).map(data => {
      let bReq: BudgetRequest;
      data.budgetRequest.supplier = budgetReq.supplier;
      data.budgetRequest.budgetReplies = data.budgetReplies.map(replyData => {
        return BudgetReply.fromJson({
          id: replyData.id,
          budget: Budget.fromJson(replyData),
          store: budgetReq.budgetReplies.find(reply => reply.store.id === replyData.storeId).store,
          status: replyData.status,
          repliedAt: replyData.repliedAt
        });
      });

      if (data.product) {
        data.budgetRequest.product = {
          id: data.product.id,
          name: data.product.name
        };
      } else {
        data.budgetRequest.product = budgetReq.product;
      }

      bReq = BudgetRequest.fromJson(data.budgetRequest)
      this.budgetRequests.unshift(bReq)

      return bReq;
    }).catch(this.handleError);
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
