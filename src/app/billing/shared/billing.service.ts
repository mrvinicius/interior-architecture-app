import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { environment } from '../../../environments/environment';

import { AuthService } from '../../core/auth.service';
import { BillingInfo } from './billing-info';

@Injectable()
export class BillingService {
  private readonly baseUrl: string = `${environment.apiBaseUrl}pagamento`;
  // Observable string sources
  private billingInfoUpdatedSource = new Subject<boolean>();
  // Observable string streams
  billingInfoUpdated$ = this.billingInfoUpdatedSource.asObservable();

  constructor(
    private auth: AuthService,
    private http: Http,
  ) { }

  addBillingInfo(billingInfo: BillingInfo): Observable<any> {
    let options = new RequestOptions({ headers: this.getHeaders() }),
      now: Date = new Date(),
      data = {
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
      },
      zerofill = (dateOrMonth: number | string): string => {
        let filled: string = String(dateOrMonth).trim();

        if (filled.length === 1) {
          filled = "0" + filled;
        }

        return filled;
      }

    switch (data.PlanIdentifier) {
      case "plano_mensal":
        data.IdPlano = "BCC49F83A0D4475D9F4A8874CA5C95BD";
        data.Valor = 99.90;
        now.setMonth(now.getMonth() + 1)
        break;

      case "plano_trimestral":
        data.IdPlano = "6C943E378CC64999906B553C3072AF48";
        data.Valor = 149.90;
        now.setMonth(now.getMonth() + 3)
        break;

      case "teste_producao2":
        data.IdPlano = "105A5EE5905F4D0B92FE21D18A5CD32E";
        data.Valor = 1.00;
        now.setDate(now.getDate() + 7) // today test
        break;
      default:
        console.error('plano não identificado');
        break;
    }

    data.DataExpiracao = zerofill(now.getMonth() + 1) + "/"
      + zerofill(now.getDate()) + "/"
      + now.getFullYear();

    return this.http.post(this.baseUrl + '/AddProfissionalAssinatura', data, options)
      .map((response: Response) => {
        let billingResp = JSON.parse(response.text());

        if (billingResp.HasError) {
          let errorMessages = [],
            msg; // Aux to larger messages

          let zerofill = (dateOrMonth: number | string): string => {
            let filled: string = String(dateOrMonth).trim();
            if (filled.length === 1)
              filled = "0" + filled;

            return filled;
          }

          if (billingResp.ErrorMessage.indexOf('não pode ficar em branco') > -1
            || billingResp.ErrorMessage.indexOf('can\'t be blank') > -1) {
            errorMessages.push('Preencha todos os campos')
          }


          if (billingResp.ErrorMessage.indexOf('Customer Not Found') > -1) {
            errorMessages.push('Customer Not Found')
          }

          if (billingResp.ErrorMessage.indexOf('is not a valid credit card number') > -1) {
            errorMessages.push('Cartão de crédito recusado')
          }

          msg = 'não está ativa para receber pagamentos pois não tem conta bancária cadastrada';
          if (billingResp.ErrorMessage.indexOf(msg) > -1) {
            // errorMessages.push('erro na conta bancãria do IUGU')
          }

          msg = 'Assinatura deste profissional para esse plano já existe';
          if (billingResp.ErrorMessage.indexOf(msg) > -1) {
            errorMessages.push('Você ja é assinante deste plano')
          }

          if (!errorMessages.length)
            errorMessages.push('Erro desconhecido')

          billingResp.errorMessages = errorMessages;
        }

        return billingResp;
      })
      .catch(this.handleError);
  }

  billingInfoUpdated(success: boolean) {
    this.billingInfoUpdatedSource.next(success);
  }

  suspendBilling(profId: string): Observable<any> {
    let options = new RequestOptions({ headers: this.getHeaders() }),
      data: any = {
        "ProfissionalId": "5cb88ad2-e641-4da3-8b8b-9f6eb0f93317",
        "IdPlano": "105A5EE5905F4D0B92FE21D18A5CD32E"
      };

    return this.http.post(this.baseUrl + '/AddProfissionalAssinatura', data, options)
      .map((response: Response) => {
        let billingResp = JSON.parse(response.text());

        if (billingResp.HasError) {
          let errorMessages = []
        }

        return billingResp;
      })
      .catch(this.handleError);

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
