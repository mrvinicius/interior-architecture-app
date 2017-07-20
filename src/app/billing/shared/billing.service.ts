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
    let now: Date = new Date();
    let data = {
      "IdPlano": "",
      "ProfissionalId": billingInfo.professionalId,
      "Descricao": "Assinatura",
      "FirstName": billingInfo.firstName,
      "LastName": billingInfo.lastName,
      "Month": billingInfo.creditCardInfo.expirationMonth,
      "Number": billingInfo.creditCardInfo.number,
      "VerificationValue": billingInfo.creditCardInfo.cvc,
      "Year": billingInfo.creditCardInfo.expirationYear,
      "PlanIdentifier": billingInfo.planIdentifier,
      "Valor": 1,
      "Quantidade": 1,
      "Recorrente": true,
      "DataExpiracao": ""
    };

    // let year = now.getFullYear();
    // currentDate.getMonth() + 1;
    // currentDate.getDate();
    let zerofill = (dateOrMonth: number | string): string => {
      let filled: string = String(dateOrMonth).trim();
      if (filled.length === 1)
        filled = "0" + filled;

      return filled;
    }

    switch (data.PlanIdentifier) {
      case "plano_mensal":
        data.IdPlano = "B8292E584F6B4EA29965BDBFD8FBF24A";
        data.Valor = 99.90;
        now.setMonth(now.getMonth() + 1)
        break;

      case "plano_trimestral":
        data.IdPlano = "6C943E378CC64999906B553C3072AF48";
        data.Valor = 119.90;
        now.setMonth(now.getMonth() + 3)
        break;

      default:
        console.error('plano não identificado');
        break;
    }

    data.DataExpiracao = zerofill(now.getMonth() + 1) + "/"
      + zerofill(now.getDate()) + "/"
      + now.getFullYear();

    console.log(data);


    return this.http.post(this.baseUrl + '/AddProfissionalAssinatura', data, options)
      .map((response: Response) => {
        let billingResp = JSON.parse(response.text());

        if (billingResp.HasError) {
          let errorMessages = [];
          console.log(billingResp.ErrorMessage);

          let zerofill = (dateOrMonth: number | string): string => {
            let filled: string = String(dateOrMonth).trim();
            if (filled.length === 1)
              filled = "0" + filled;

            return filled;
          }

          if (billingResp.ErrorMessage
            .indexOf('is not a valid credit card number') > -1) {
            errorMessages.push('Cartão de crédito inválido')
          }

          if (billingResp.ErrorMessage.indexOf('não pode ficar em branco') > -1
            || billingResp.ErrorMessage.indexOf('can\'t be blank') > -1) {
            errorMessages.push('Dados em branco')
          }

          let msg = 'não está ativa para receber pagamentos pois não tem conta bancária cadastrada';
          if (billingResp.ErrorMessage.indexOf(msg) > -1) {
            errorMessages.push('Dados de cartão de crédito inválidos')
          }

            if (!errorMessages.length) errorMessages.push('Erro desconhecido')
          billingResp.errorMessages = errorMessages;
        }

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

  private handleErrMsg(errMsg): string {
    let userMsg: string = '';

    switch (errMsg) {
      case "não pode ficar em branco":
      case "can't be blank":
        userMsg = 'Dados em branco';
        break;
      case "is not a valid credit card number":
        userMsg = 'Cartão de crédito inválido';
        break;
      default:
        userMsg = 'Erro desconhecido'
        break;
    }

    return userMsg;
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
