import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch'

import { AuthService } from '../../core/auth.service';
import { Client } from './client';
import { clients } from './mock-client';
import { Professional } from '../../core/professional';
import { ProfessionalService } from '../../core/professional.service';

@Injectable()
export class ClientService {
  public allClients: Client[] = [];
  allClientsChange$: Subject<Client[]> = new Subject<Client[]>();
  private readonly baseUrl: string = 'http://52.67.21.201/muuving/api/cliente';

  constructor(
    private auth: AuthService,
    private http: Http,
    private profService: ProfessionalService
  ) {
    // this.getAllByProfessional(this.profService.professional.id).subscribe((clients: Client[]) => {
    // this.getAllByProfessional(this.auth.getCurrentUser().id).subscribe((clients: Client[]) => {
    //   this.allClients = clients;
    //   this.allClientsChange$.next(this.allClients);
    // });

  }

  addByProfessional(client: Client, profissionalId: string): Observable<Client> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    let data = {
      Nome: client.name,
      Email: client.email,
      Genero: client.gender,
      CpfCnpj: client.cpfCnpj,
      Ativo: true,
      Profissional: { Id: profissionalId }
    };

    return this.http
      .put(this.baseUrl + '/add', data, options)
      .map((response: Response) => {
        let body = JSON.parse(response.text());
        let newClient: Client = new Client(body.Nome, body.Email, body.ID);
        newClient.cpfCnpj = body.CpfCnpj;
        if (!this.allClients) this.allClients = [];

        this.allClients.push(newClient);
        this.allClientsChange$.next(this.allClients);
        this.profService.addClients(newClient);
        return newClient;
      })
      .catch(this.handleError);
  }

  getAllByProfessional(profissionalId: string, take: number = 999, skip?: number): Observable<Client[]> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    let data = {
      Skip: skip,
      Take: take,
      ProfissionalId: profissionalId
    };

    if (this.allClients === undefined || this.allClients.length < 1) {
      return this.http
        .post(this.baseUrl + '/getall', data, options)
        .map((response: Response) => {
          let body = JSON.parse(response.text());
          let clients: Client[] = [];

          if (body.length) {
            clients = body.map((client) => {
              return new Client(client.Nome, client.Email, client.ID);
            });
          }

          this.allClients = clients;
          return this.allClients;
        })
        .catch(this.handleError);
    } else {
      return Observable.of(this.allClients);
    }


  }

  getOne(id: string, getFromDatabase?: boolean): Observable<Client> {
    if (getFromDatabase) {
      let options = new RequestOptions({ headers: this.getHeaders() });

      return this.http.get(this.baseUrl + '/getone?id=' + id, options)
        .map((response: Response) => {
          let body = JSON.parse(response.text());
          let client = new Client(body.Nome, body.Email, body.ID);
          client.cpfCnpj = body.CpfCnpj;

          return client;
        })
        .catch(this.handleError);
    } else {
      return Observable.of(this.allClients.find((client: Client) => {
        return client.id === id;
      }));
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
