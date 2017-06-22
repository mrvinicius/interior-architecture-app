import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { AuthService } from './auth.service';
import { Client } from '../client/shared/client';
import { Professional } from './professional';
import { Profession } from '../shared/profession.enum';

@Injectable()
export class ProfessionalService {
  public allProfessionals: Professional[] = [];
  public static readonly professionIds: any = {
    0: 'EST',
    1: 'ARQ',
    2: 'DES',
    'EST': 0,
    'ARQ': 1,
    'DES': 2,
  }
  professionalChange$: Subject<Professional> = new Subject<Professional>();
  professionalAdded$: Subject<Professional> = new Subject<Professional>();
  modalDismissed$: Subject<Professional> = new Subject<Professional>();
  allProfessionalsChange$: Subject<Professional[]> = new Subject<Professional[]>();
  private readonly baseUrl: string = 'http://52.67.21.201/muuving/api/profissional';
  private _professional: Professional;

  constructor(
    private auth: AuthService,
    private http: Http
  ) {
    // this._professional = new Professional();
    // this._professional.id = 'c11752b0-0475-4d31-9c01-223d1a98aa9f';
    // this._professional.name = 'Raphael Tristão';
    // this._professional.email = 'raphael@muuving.com.br';
    // this._professional.profession = ProfessionalService.professionIds[0];
    // this._professional.description = 'Escritório de interiores criado por Raphael Tristão';

    // this._professional = new Professional();
    // this._professional.id = this.auth.currentUser.id;
    // this._professional.email = this.auth.currentUser.email;
    // this._professional.profession = Profession.Arquiteto; // TODO: Remove mock

    if (localStorage.getItem('currentUser')) {
      this.getOne(this.auth.getCurrentUser().id).subscribe((currentProf: Professional) => {
        this._professional = currentProf;

        this.professionalChange$.next(this._professional);
      });
    }

    this.getAll().subscribe((professionals: Professional[]) => {
      this.allProfessionals = professionals;
      this.allProfessionalsChange$.next(this.allProfessionals);
    });
  }

  set professional(professional: Professional) {
    this._professional = professional;
  }

  get professional(): Professional {
    return this._professional;
  }

  activate(email: string): Observable<Response> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    let data = { Email: email }

    return this.http.post(this.baseUrl + '/activate', data, options)
      .map((response: Response) => {
        return response;
      }).catch(this.handleError)
  }

  // Adiciona um novo profissional à base e atualiza os dados locais
  add(prof: Professional, isSignUp?: boolean) {
    let options = new RequestOptions({ headers: this.getHeaders() });
    let data = { Email: prof.email, Nome: prof.name };

    return this.http.put(this.baseUrl + '/add', data, options)
      .map((response: Response) => {
        let profResp: any = JSON.parse(response.text());
        let prof: Professional = new Professional(profResp.Nome, profResp.Email, profResp.Id);

        prof.cpfCnpj = profResp.CpfCnpj;
        prof.celular = profResp.Celular;
        prof.profession = ProfessionalService.professionIds[profResp.ProfissaoId];

        if (!isSignUp) {
          if (!this.allProfessionals) this.allProfessionals = [];
          this.allProfessionals.push(prof);
          this.allProfessionalsChange$.next(this.allProfessionals);
          this.professionalAdded$.next(prof);
        }

        return prof;
      }).catch(this.handleError)
    // .subscribe(professional => {
    //   if (professional) {
    //     let prof = new Professional();
    //     prof.id = professional.Id;
    //     prof.name = professional.Nome;
    //     prof.email = professional.Email;
    //     this.professionalAdded$.next(prof);
    //   }
    // });
  }

  // Adiciona um novo cliente associado a este profissional à base e atualiza os dados locais
  addClients(clients: Client | Client[]) {
    if (this._professional.clients === undefined) this._professional.clients = []

    this._professional.clients.concat(clients);
  }

  getCurrentProfessional(): Observable<Professional> {
    if (this._professional === undefined) {
      let obs = this.getOne(this.auth.getCurrentUser().id);
      obs.subscribe((currentProf: Professional) => {
        this._professional = currentProf;

        this.professionalChange$.next(this._professional);
      });
      return obs;
    } else {
      return Observable.of(this._professional);
    }

  }

  getAll(take: number = 999, skip?: number): Observable<Professional[]> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    let data = {
      Skip: skip,
      Take: take
    };

    if (this.allProfessionals === undefined || this.allProfessionals.length < 1) {
      return this.http.post(this.baseUrl + '/getall', data, options)
        .map((response: Response) => {
          let body = JSON.parse(response.text());
          let professionals: Professional[] = [];

          if (body.length) {
            professionals = body.map((professional) => {
              return new Professional(professional.Nome, professional.Email, professional.Id);
            });
          }

          this.allProfessionals = professionals;
          return this.allProfessionals;
        })
        .catch(this.handleError);
    } else {
      return Observable.of(this.allProfessionals);
    }


  }

  getOne(id: string): Observable<Professional> {
    let options = new RequestOptions({ headers: this.getHeaders() });

    //http://52.67.21.201/muuving/api/profissional/getone?id=c11752b0-0475-4d31-9c01-223d1a98aa9f
    return this.http.get(this.baseUrl + '/getone?id=' + id, options)
      .map((response: Response) => {
        let body = JSON.parse(response.text());
        let professional = new Professional(body.Nome, body.Email, body.Id);
        professional.cpfCnpj = body.CpfCnpj;
        professional.celular = body.Celular;
        professional.profession = ProfessionalService.professionIds[body.ProfissaoId];
        professional.description = body.Descricao;
        professional.CEP = body.CEP;
        professional.paying = body.Assinante ? body.Assinante : false;
        professional.iuguId = body.IdClienteIugu ? body.IdClienteIugu : undefined;

        professional.nacionality = body.Nacionalidade;
        professional.gender = body.Genero;
        professional.maritalStatus = body.EstadoCivil;
        professional.CAU = body.Cau;
        professional.addressArea = body.Logradouro;
        professional.addressNumber = body.NumeroLogradouro;

        return professional;
      })
      .catch(this.handleError);
  }

  login(email: string, password: string): Observable<any> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    let data = {
      Email: email,
      Senha: password
    };

    return this.http.post(this.baseUrl + '/login', data, options)
      .map((response: Response) => {
        let profResp = JSON.parse(response.text());
        let prof: Professional = new Professional();

        // prof.id = 'c11752b0-0475-4d31-9c01-223d1a98aa9f';
        // prof.name = 'Raphael Tristão';
        // prof.email = 'raphael@muuving.com.br';
        // prof.profession = ProfessionalService.professionIds[0];
        // prof.description = 'Escritório de interiores criado por Raphael Tristão';


        if (!profResp.HasError) {
          prof = new Professional(
            profResp.Nome,
            profResp.Email,
            profResp.Id
          );
          prof.cpfCnpj = profResp.CpfCnpj;
          prof.celular = profResp.Celular;
          prof.profession = ProfessionalService.professionIds[profResp.ProfissaoId];
          prof.description = profResp.Descricao;
          prof.gender = profResp.Genero;
          prof.maritalStatus = profResp.EstadoCivil;
          prof.nacionality = profResp.Nacionalidade;
          prof.CAU = profResp.Cau;
          prof.CEP = profResp.CEP;
          prof.paying = profResp.Assinante;
          prof.addressArea = profResp.Logradouro;
          prof.addressNumber = profResp.NumeroLogradouro;
          this._professional = prof;
          this.auth.login(prof);
        }



        return {
          HasError: profResp.HasError,
          ErrorMessage: profResp.ErrorMessage,
          professional: prof
        };
      }).catch(this.handleError);
  }

  // Update data base and local Professional User
  update(prof: Professional): Observable<any> {
    let options = new RequestOptions({ headers: this.getHeaders() });

    if (prof.name) this._professional.name = prof.name;
    if (prof.email) this._professional.email = prof.email;
    if (prof.description !== undefined) this._professional.description = prof.description;
    if (prof.cpfCnpj) this._professional.cpfCnpj = prof.cpfCnpj;
    if (prof.celular) this._professional.celular = prof.celular;
    if (prof.password) this._professional.password = prof.password;
    if (prof.profession) this._professional.profession = prof.profession;
    if (prof.CAU) this._professional.CAU = prof.CAU;
    if (prof.gender) this._professional.gender = prof.gender;
    if (prof.paying) this._professional.paying = prof.paying;
    if (prof.CEP) this._professional.CEP = prof.CEP;
    if (prof.nacionality) this._professional.nacionality = prof.nacionality;
    if (prof.maritalStatus) this._professional.maritalStatus = prof.maritalStatus;
    if (prof.addressArea) this._professional.addressArea = prof.addressArea;
    if (prof.addressNumber) this._professional.addressNumber = prof.addressNumber;

    let data: any = {
      id: this._professional.id,
      Nome: this._professional.name,
      Email: this._professional.email,
      Descricao: this._professional.description,
      CpfCnpj: this._professional.cpfCnpj,
      Celular: this._professional.celular,
      ProfissaoId: ProfessionalService.professionIds[this._professional.profession],
      CAU: this._professional.CAU,
      Assinante: this._professional.paying,
      CEP: this._professional.CEP,
      Nacionalidade: this._professional.nacionality,
      Genero: this._professional.gender,
      EstadoCivil: this._professional.maritalStatus,
      Cau: this._professional.CAU,
      Logradouro: this._professional.addressArea,
      NumeroLogradouro: this._professional.addressNumber
    };


    if (prof.password) {
      data.Senha = this._professional.password;
    }

    if (data.Senha) {
      console.log(data.Senha);
      alert('Senha alterada')
    }

    // console.log(data);

    return this.http.post(this.baseUrl + '/update', data, options)
      .map(response => {
        let profResp = JSON.parse(response.text());

        return profResp;
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
