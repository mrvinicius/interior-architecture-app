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

  // Observable string sources
  // private clientAddedSource = new Subject<Client>();
  // clientAdded$ = this.clientAddedSource.asObservable();
  // public modalDismissedSource = new Subject<any>();
  // modalDismissed$ = this.modalDismissedSource.asObservable();
  private readonly baseUrl: string = 'https://www.archabox.com.br/api/cliente';

  constructor(
    private auth: AuthService,
    private http: Http,
    private profService: ProfessionalService
  ) { }

  addByProfessional(client: Client, profId: string): Observable<any> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    let data = {
      Nome: client.name,
      Email: client.email,
      Genero: client.gender,
      CpfCnpj: client.cpfCnpj,
      IsActive: true,
      Profissional: { Id: profId }
    };

    return this.http
      .put(this.baseUrl + '/add', data, options)
      .map((response: Response) => {
        let clientResp = JSON.parse(response.text());

        if (clientResp.HasError) {
          let errorMessages = [];
          errorMessages.push(this.handleErrMsg(clientResp.ErrorMessage))
          clientResp.errorMessages = errorMessages;
        } else {
          let newClient: Client = new Client(clientResp.Nome, clientResp.Email, clientResp.ID);
          newClient.isActive = clientResp.IsActive;
          newClient.gender = clientResp.Genero;
          newClient.cpfCnpj = clientResp.CpfCnpj;


          if (!this.allClients) this.allClients = [];
          clientResp.client = newClient;
          this.allClients.push(newClient);
          this.allClientsChange$.next(this.allClients);
          // this.clientAddedSource.next(newClient);
          this.profService.addClients(newClient);
        }



        return clientResp;
      })
      .catch(this.handleError);
  }

  disableClient(id: string, profId: string): Observable<any> {
    let c = this.allClients.find(client => client.id === id);

    c.isActive = false;
    return this.update(c, profId);
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
              let c = new Client(client.Nome, client.Email, client.ID);
              c.isActive = client.IsActive;
              c.gender = client.Genero;
              c.cpfCnpj = client.CpfCnpj;
              return c;
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

  getOne(id: string, fromBackEnd?: boolean): Observable<Client> {
    if (fromBackEnd) {
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

  update(client: Client, profId: string): Observable<any> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    let clientIndex = this.allClients.findIndex(c => c.id === client.id);
    let data = {
      "id": client.id,
      "Nome": client.name,
      "Email": client.email,
      "CpfCnpj": client.cpfCnpj,
      "IsActive": client.isActive,
      "Genero": client.gender,
      "Profissional": {
        "id": profId
      }
    }

    this.allClients[clientIndex] = client;

    return this.http.post(this.baseUrl + '/update', data, options)
      .map((response: Response) => {
        let clientResp = JSON.parse(response.text());

        return clientResp;
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

  private handleErrMsg(errMsg): string {
    let userMsg: string = '';

    switch (errMsg) {
      case "CPF já cadastrado":
        userMsg = 'CPF/CNPJ já cadastrado';
        break;
      case "Nome do cliente não informado":
        userMsg = 'Nome do cliente não informado';
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
