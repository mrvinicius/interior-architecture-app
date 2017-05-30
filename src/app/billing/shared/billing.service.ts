import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { AuthService } from '../../core/auth.service';
import { BillingInfo } from './billing-info';

@Injectable()
export class BillingService {
  private readonly baseUrl: string = 'http://52.67.21.201/muuving/api/pagamento';
  // Observable string sources
  private billingInfoUpdatedSource = new Subject<boolean>();
  // Observable string streams
  billingInfoUpdated$ = this.billingInfoUpdatedSource.asObservable();

  constructor(
    private auth: AuthService,
    private http: Http,
  ) { }

  addBillingInfo(billingInfo: BillingInfo): Observable<any> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    let data = {
      "ProfissionalId": billingInfo.professionalId,
      "Descricao": "Mensalidade",
      "FirstName": billingInfo.firstName,
      "LastName": billingInfo.lastName,
      "Month": billingInfo.creditCardInfo.expirationMonth,
      "Number": billingInfo.creditCardInfo.number,
      "VerificationValue": billingInfo.creditCardInfo.cvc,
      "Year": billingInfo.creditCardInfo.expirationYear,
      "Valor": 1,
      "Quantidade": 1,
      "Recorrente": true,
      "PlanIdentifier": "basic_plan",
      "DataExpiracao": "12/31/2017"
    };

    return this.http.post(this.baseUrl + '/AddProfissionalAssinatura', data, options)
      .map((response: Response) => {
        let billingResp = JSON.parse(response.text());

        return billingResp;
      })
      .catch(this.handleError);
  }

  billingInfoUpdated(success: boolean) {
    this.billingInfoUpdatedSource.next(success);
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
