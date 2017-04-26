import { AuthService } from './../../core/auth.service';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch'

import { Client } from './client';
import { clients } from './mock-client';
import { Professional } from '../../core/professional';
import { ProfessionalService } from '../../core/professional.service';

@Injectable()
export class ClientService {
  public allClients: Client[];
  allClientsChange$: Subject<Client[]> = new Subject<Client[]>();
  private readonly baseUrl: string = 'http://52.67.21.201/muuving/api/cliente';

  constructor(
    private http: Http,
    private auth: AuthService,
    private profService: ProfessionalService
  ) {
    // console.log(this.profService.professional)
    // console.log(this.profService.serviceId)
    // console.log('Client Service ctor');
    this.getAllByProfessional(this.auth.currentUser.id).subscribe((clients: Client[]) => {
      this.allClients = clients;
      this.allClientsChange$.next(this.allClients);
    });

  }

  addByProfessional(client: Client, profissionalId: string): Observable<Client> {
    let options = new RequestOptions({ headers: this.getHeaders() });

    return this.http
      .put(this.baseUrl + '/add', {
        Nome: client.name,
        Email: client.email,
        CpfCnpj: client.cpfCnpj,
        Ativo: true,
        Profissional: { Id: profissionalId }
      }, options)
      .map((response: Response) => {
        let body = JSON.parse(response.text());
        let newClient: Client = new Client(body.Nome, body.Email, body.ID);
        newClient.cpfCnpj = body.CpfCnpj;

        this.allClients.push(newClient);
        this.allClientsChange$.next(this.allClients);

        return newClient;
      })
      .catch(this.handleError);
  }

  getAllByProfessional(profissionalId: string, take: number = 999, skip?: number): Observable<Client[]> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    return this.http
      .post(this.baseUrl + '/getall', {
        Skip: skip,
        Take: take,
        ProfissionalId: profissionalId
      }, options)
      .map((response: Response) => {
        let body = JSON.parse(response.text());
        return body.map((client) => {
          
          return new Client(String(client.Nome), String(client.Email), String(client.ID));
        });

      })
      .catch(this.handleError);
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
