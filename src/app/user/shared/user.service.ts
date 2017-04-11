import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

const baseUrl: string = 'http://52.67.21.201/';

@Injectable()
export class UserService {

  constructor(
    private http: Http
  ) { }

  /** API Usage example */
  // getAll(): Promise<Any[]> {
  //   let options = new RequestOptions({ headers: this.getHeaders() });

  //   return this.http
  //     .get(baseUrl + 'muuving/api/profissao/getall', options)
  //     .toPromise()
  //     .then(this.extractData)
  //     .catch(this.handleError);
  // }

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