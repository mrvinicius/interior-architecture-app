import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from "rxjs/Subject";

import { AuthService } from '../../core/auth.service';
import { Bank } from './bank';
import { BankAccount } from './bank-account';
import { BankService } from './bank.service';
import { ProfessionalService } from '../../core/professional.service';


@Injectable()
export class BankAccountService {
  private bankAccounts: BankAccount[] = [];
  private readonly baseUrl: string = 'http://52.67.21.201/muuving/api/conta';

  constructor(
    private auth: AuthService,
    private bankService: BankService,
    private http: Http,
    private profService: ProfessionalService
  ) { }

  addByProfessional(bankAcc: BankAccount, profissionalId: string): Observable<BankAccount> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    let data = {
      Agencia: bankAcc.agency,
      Conta: bankAcc.accountNumber,
      DigitoConta: bankAcc.accountDigit,
      ProfissionalId: profissionalId,
      Banco: { id: bankAcc.bank.id }
    }

    return this.http
      .put(this.baseUrl + '/add', data, options)
      .map((response: Response) => {
        let bankAccData = JSON.parse(response.text());
        
        let bankAccResult: BankAccount =
          new BankAccount(bankAccData.Agencia, bankAccData.Conta, bankAccData.DigitoConta, bankAccData.Id);

        bankAccResult.bank = bankAcc.bank;
        // newClient.cpfCnpj = body.CpfCnpj;

        // this.allClients.push(newClient);
        // this.allClientsChange$.next(this.allClients);
        // this.profService.addClients(newClient);
        return bankAccResult;
      })
      .catch(this.handleError);
  }

  getAllByProfessional(profissionalId: string, take: number = 999, skip?: number): Observable<BankAccount[]> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    let data = {
      Skip: skip,
      Take: take,
      ProfissionalId: profissionalId
    };

    if (this.bankAccounts === undefined || this.bankAccounts.length < 1) {
      
      return this.http
        .post(this.baseUrl + '/getall', data, options)
        .map((response: Response) => {
          let body = JSON.parse(response.text());
          // {
          //   "HasError": true,
          //     "ErrorMessage": "Nenhum registro encontrado"
          // }

          if (!body.HasError) {
            let accs: BankAccount[] = body.map((bankAcc) => {
              let acc: BankAccount =
                new BankAccount(bankAcc.Agencia, bankAcc.Conta, bankAcc.DigitoConta, bankAcc.Id);

              if (bankAcc)
                acc.bank = new Bank(bankAcc.Banco.Id, bankAcc.Banco.Nome, bankAcc.Banco.NomeCompleto);

              return acc;
            });
            
            this.bankAccounts = accs;
            return accs;
          } else {
            return null;
          }


        })
        .catch(this.handleError);
    } else {
      return Observable.of(this.bankAccounts);
    }

  }

  getOne(id: string): Observable<BankAccount> {
    if (this.bankAccounts === undefined || this.bankAccounts.length < 1) {
      this.getAllByProfessional(this.auth.getCurrentUser().id);
    }

    return Observable.of(this.bankAccounts.find((bankAcc: BankAccount) => bankAcc.id === id));
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
