import { AuthService } from '../../core/auth.service';
import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from "rxjs/Subject";

import { Bank } from './bank';
import { ProfessionalService } from '../../core/professional.service';


@Injectable()
export class BankService {
  private allBanks: Bank[] = [];
  private readonly baseUrl: string = 'https://archaboxapi.azurewebsites.net/api/banco';

  constructor(
    private http: Http,
    private auth: AuthService,
    private profService: ProfessionalService
  ) {

  }

  getAll(take: number = 999, skip?: number): Observable<Bank[]> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    let data = {
      Skip: skip,
      Take: take
    };

    if (this.allBanks === undefined || this.allBanks.length < 1) {
      return this.http
        .get(this.baseUrl + '/getall', options)
        .map((response: Response) => {
          let body = JSON.parse(response.text());
          
          let banks: Bank[] = body.map((bank) => {
            return new Bank(bank.Id, bank.Nome, bank.NomeCompleto);
          });
          this.allBanks = banks;
          return banks;
        })
        .catch(this.handleError);
    } else {
      return Observable.of(this.allBanks);
    }
  }

  getOne(id: number): Observable<Bank> {
    // this.getAll().find((banks: Bank[]) => {
    //   console.log(banks);

    //   return true;
    // });

    // // return banks.find((bank: Observable<Bank>) => { return bank.id === id });

    if (this.allBanks === undefined || this.allBanks.length < 1) {
      this.getAll();
      return Observable.of(this.allBanks.find((bank: Bank) => bank.id === id));
    } else {
      return Observable.of(this.allBanks.find(bank => bank.id === id));
    }

  }

  private extractData(res: Response) {
    return res.json();
  }

  private getHeaders() {
    let headers = new Headers();

    headers.append('Authorization', 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

    return headers;
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
