import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/toPromise';

import { User } from './user';
import { users } from './mock-user';

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

    return this.http.put(baseUrl + 'muuving/api/profissional/add', { email: user.email, nome: user.name }, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  auth(email: string, password: string): Promise<any> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    let response = { user: null };
    response.user = users.find(user => {
      if (user.email !== email && user.password !== password) {
        return false;
      } else if (user.email == email && user.password == password) {
        return true;
      }
      
      return false;
    });


    return Promise.resolve(response);
  }

  private extractData(res: Response) {
    return res.json();
  }

  private getHeaders() {
    let headers = new Headers();

    headers.append("Authorization", "Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==");
    headers.append("Content-Type", 'application/json');

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

  private showData(json) {
    console.log(json);
  }
}
