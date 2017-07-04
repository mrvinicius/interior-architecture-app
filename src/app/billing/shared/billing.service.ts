import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { AuthService } from '../../core/auth.service';
import { BillingInfo } from './billing-info';

@Injectable()
export class BillingService {
  private readonly baseUrl: string = 'https://www.archabox.com.br/api/pagamento';
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
        data.IdPlano = "9D55A163EEF144E4970EA2FD3D23BFE9";
        data.Valor = 99.90;
        now.setMonth(now.getMonth() + 1)
        break;

      case "plano_trimestral":
        data.Valor = 119.90;
        now.setMonth(now.getMonth() + 3)
        break;


      case "plano_1real":
        data.IdPlano = "722A5DC954394AFE91E5E3A2AA74DCDF";
        data.Valor = 1.0;
        now.setMonth(now.getMonth() + 1)
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
          
          console.log(typeof billingResp.ErrorMessage);
          

          if (billingResp.ErrorMessage.contains('is not a valid credit card number')) {
            errorMessages.push('Cartão de crédito inválido')
          }

          if (billingResp.ErrorMessage.contains('')) {

          }


            // let jsonError = "{\"errorMessage\": \"" + billingResp.ErrorMessage + "\" }";
            // console.log(jsonError);
            // // let errorObject = JSON.parse(billingResp.ErrorMessage.replace(/\\/g, ""));
            // let errorObject = JSON.parse(jsonError.replace(/\\/g, ""));
            // console.log(errorObject);

            // if (errorObject.errorMessage && typeof errorObject.errorMessage === 'object') {
            //   errorObject.errorMessage.Message.Errors.number.forEach(errMsg => {
            //     errorMessages.push(this.handleErrMsg(errMsg));
            //   });
            // } else {
            //   errorMessages.push(this.handleErrMsg(errorObject.errorMessage))
            // }
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
