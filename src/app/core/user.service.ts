import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Rx';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch'
// import 'rxjs/add/operator/toPromise';

// import { User } from './user';

@Injectable()
export class UserService {
  // public user: User;

  constructor(
  ) { }

  // private extractData(res: Response) {
  //   return res.json();
  // }

  // private getHeaders() {
  //   let headers = new Headers();

  //   headers.append("Authorization", "Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==");
  //   headers.append("Content-Type", 'application/json');

  //   return headers;
  // }

  // private handleError(error: Response | any) {
  //   // In a real world app, you might use a remote logging infrastructure
  //   let errMsg: string;
  //   if (error instanceof Response) {
  //     const body = error.json() || '';
  //     const err = body.error || JSON.stringify(body);
  //     errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  //   } else {
  //     errMsg = error.message ? error.message : error.toString();
  //   }
  //   console.error(errMsg);
  //   return Observable.throw(errMsg);
  // }
}
