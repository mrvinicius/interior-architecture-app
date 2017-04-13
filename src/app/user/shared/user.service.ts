import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/toPromise';

import { User } from "./user";

const baseUrl: string = 'http://52.67.21.201/';

@Injectable()
export class UserService {

  constructor(
    private http: Http
  ) { }

  // add(user) {
  //   let options = new RequestOptions({ headers: this.getHeaders() });

  //   return this.http
  //     .put(baseUrl + 'muuving/api/profissional/add', {nome: "Vinicius", email: "vinicius.rocha@muuving.com.br"}, options)
  //     .toPromise()
  //     .then(this.extractData)
  //     .catch(this.handleError);
  // }

  add(user) {
    let options = new RequestOptions({ headers: this.getHeaders() });
    console.log(user);
    return this.http.put(baseUrl + 'muuving/api/profissional/add', { email: user.email, nome: user.name }, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private getHeaders() {
    let headers = new Headers();

    headers.append("Authorization", "Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==");
    headers.append("Content-Type", 'application/json');

    return headers;
  }

  private handleError(error: Response | any) {
    let errMsg: string = "Deu erro!";
    return Promise.reject(errMsg);
  }

  private showData(json) {
    console.log(json);
  }
}
