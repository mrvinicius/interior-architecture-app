import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Supplier } from './supplier';

@Injectable()
export class SupplierService {
  private readonly baseUrl = 'http://localhost:8000/api/supplier';
  private suppliers: Supplier[]

  constructor(private http: HttpClient) {

  }

  getAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.baseUrl}/getAll`, {
      headers: this.getHeaders(),
      observe: 'body',
      responseType: 'json',
      // withCredentials: true
    }).map(data => {
      return data;
    }).catch(this.handleError)
  }

  search(text: Observable<string>) {
    // text.debounceTime(500)
    //   .distinctUntilChanged()
    //   .takeUntil()
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
      console.log('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.log(`Backend returned code ${error.status}, body was: ${error.error}`);
    }

    return Observable.throw(error)
  }

  // private handleError(error: Response | any) {
  //   // In a real world app, you might use a remote logging infrastructure
  //   let errMsg: string;
  //   if (error instanceof Response) {
  //     const body = error.json() || '';
  //     const err = body.error || JSON.stringify(body);
  //     errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  //   } else {
  //     errMsg = error.message ? error.message : error.toString();
  //   }
  //   console.error(errMsg);
  //   return Observable.throw(errMsg);
  // }
}
