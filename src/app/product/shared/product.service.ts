import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Product } from './product';

@Injectable()
export class ProductService {
  private readonly baseUrl = 'http://localhost:8000/api/product';

  constructor(private http: HttpClient) { }

  getAllBySupplier(supplierId?: string): Observable<Product[]> {
    let reqUrl = `${this.baseUrl}/getAll`;
    reqUrl += supplierId !== undefined ? `?supplierId=${supplierId}` : '';

    return this.http.get<Product[]>(reqUrl, {
      headers: this.getHeaders(),
      observe: 'body',
      responseType: 'json',
      // withCredentials: true
    }).map(data => {
      
      return data;
    }).catch(this.handleError)
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();

    headers.set('Authorization', 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==');
    headers.set('Content-Type', 'application/json');
    headers.set('Access-Control-Allow-Origin', '*');
    // headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

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

// let reqUrl = `${this.baseUrl}/getAll`;

//     if (supplierId !== undefined) {
//       reqUrl += `?supplierId=${supplierId}`;
//     }
