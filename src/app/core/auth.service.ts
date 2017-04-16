import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { User } from "app/user/shared/user";

@Injectable()
export class AuthService {
  public token: string;
  isLoggedIn: boolean = false;
  // store the URL so we can redirect after logging in
  redirectUrl: string;


  constructor(private http: Http) { }


  login(email: string, password: string): Observable<boolean> {
    let isUser: boolean = email == 'raphael@muuving.com.br' && password == 'casacor';

    if (isUser) {
      // Two approaches
      localStorage.setItem('currentUser', JSON.stringify({
        "Id": "c11752b0-0475-4d31-9c01-223d1a98aa9f",
        "CpfCnpj": null,
        "Nome": "Raphae",
        "Email": "raphael@muuving.com.br",
        "Celular": null,
        "Validado": false,
        "ProfissaoId": null
      }));
      this.isLoggedIn = true;
    }

    return Observable.of(isUser).delay(1000).do(val => this.isLoggedIn = true);
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('id_token');
  }

  // getUser(): Observable<User> | User {

  // }
}
