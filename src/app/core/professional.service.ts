import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/toPromise';

import { Client } from './../client/shared/client';
import { Professional } from './professional';
import { Profession } from '../shared/profession.enum';

@Injectable()
export class ProfessionalService {
  public allProfessionals: Professional[] = [];
  public static readonly professionIds: any = {
    0: 'ARQ',
    1: 'DES',
    2: 'EST',
    'ARQ': 0,
    'DES': 1,
    'EST': 2
  }
  professionalChange$: Subject<Professional> = new Subject<Professional>();
  professionalAdded$: Subject<Professional> = new Subject<Professional>();
  allProfessionalsChange$: Subject<Professional[]> = new Subject<Professional[]>();
  private readonly baseUrl: string = 'http://52.67.21.201/muuving/api/profissional';
  private _professional: Professional;

  constructor(
    private auth: AuthService,
    private http: Http
  ) {
    this._professional = new Professional();
    this._professional.id = this.auth.currentUser.id;
    this._professional.email = this.auth.currentUser.email;
    this._professional.profession = Profession.Arquiteto; // TODO: Remove mock
    
    this.getOne(this.auth.currentUser.id).subscribe((currentProf: Professional) => {
      this._professional.name = currentProf.name;
      this._professional.description = currentProf.description;
      this._professional.cpfCnpj = currentProf.cpfCnpj;
      this._professional.celular = currentProf.celular;
      this._professional.profession = currentProf.profession;

      this.professionalChange$.next(this._professional);
    });

    this.getAll().subscribe((professionals: Professional[]) => {
      this.allProfessionals = professionals;
      this.allProfessionalsChange$.next(this.allProfessionals);
    });
  }

  set professional(professional: Professional) {

  }

  get professional(): Professional {
    return Object.assign(this._professional);
  }

  // Adiciona um novo profissional à base e atualiza os dados locais
  add(prof: Professional) {
    let options = new RequestOptions({ headers: this.getHeaders() });

    return this.http.put(this.baseUrl + '/add', { Email: prof.email, Nome: prof.name }, options)
      .map(this.extractData)
      .catch(this.handleError).subscribe(professional => {
        if (professional) {
          let prof = new Professional();
          prof.id = professional.Id;
          prof.name = professional.Nome;
          prof.email = professional.Email;
          this.allProfessionals.push(prof);
          this.professionalAdded$.next(prof);
          this.allProfessionalsChange$.next(this.allProfessionals);
        }
      });
  }

  // Adiciona um novo cliente associado a este profissional à base e atualiza os dados locais
  addClients(clients: Client | Client[]) {
    if (this._professional.clients === undefined) this._professional.clients = []

    this._professional.clients.concat(clients);
  }

  getOne(id: string): Observable<Professional> {
    let options = new RequestOptions({ headers: this.getHeaders() });

    //http://52.67.21.201/muuving/api/profissional/getone?id=c11752b0-0475-4d31-9c01-223d1a98aa9f
    return this.http.get(this.baseUrl + '/getone?id=' + id, options)
      .map((response: Response) => {
        let body = JSON.parse(response.text());
        let professional = new Professional(body.Nome, body.Email, body.Id)
        professional.cpfCnpj = body.CpfCnpj;
        professional.celular = body.Celular;
        professional.profession = ProfessionalService.professionIds[body.ProfissaoId];
        professional.description = body.Descricao;

        return professional;
      })
      .catch(this.handleError);
  }

  getAll(take: number = 999, skip?: number): Observable<Professional[]> {
    let options = new RequestOptions({ headers: this.getHeaders() });

    return this.http.post(this.baseUrl + '/getall', {
      Skip: skip,
      Take: take
    }, options)
      .map((response: Response) => {
        let body = JSON.parse(response.text());

        return body.map((professional) => {
          return new Professional(professional.Nome, professional.Email, professional.Id);
        });
      })
      .catch(this.handleError);
  }

  // Update data base and local Professional User
  update(prof: Professional) {
    let options = new RequestOptions({ headers: this.getHeaders() });

    if (prof.name) this._professional.name = prof.name;
    if (prof.email) this._professional.email = prof.email;
    if (prof.description !== undefined) this._professional.description = prof.description;
    if (prof.cpfCnpj) this._professional.cpfCnpj = prof.cpfCnpj;
    if (prof.celular) this._professional.celular = prof.celular;
    if (prof.password) this._professional.password = prof.password; 
    if (prof.profession) this._professional.profession = prof.profession;

    let data: any = {
      id: this._professional.id,
      Nome: this._professional.name,
      Email: this._professional.email,
      Descricao: this._professional.description,
      CpfCnpj: this._professional.cpfCnpj,
      Celular: this._professional.celular,
      Senha: this._professional.password,
      ProfissaoId: ProfessionalService.professionIds[this._professional.profession]
    };

    // if (this._professional.description && this._professional.description.length > 0) data.Descricao = this._professional.description;
    // if (this._professional.cpfCnpj) data.CpfCnpj = this._professional.cpfCnpj;
    // if (this._professional.celular) data.Celular = this._professional.celular;
    // if (this._professional.professionId) data.ProfissaoId = this._professional.professionId;

    // console.log(data);

    return this.http.post(this.baseUrl + '/update', data, options)
      .map(response => {
        return response;
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
