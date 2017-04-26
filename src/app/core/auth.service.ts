import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { User } from './user';

@Injectable()
export class AuthService {
  public token: string;
  public currentUser: User;
  isLoggedIn: boolean = false;
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private http: Http) {
    this.currentUser = {
      id: 'c11752b0-0475-4d31-9c01-223d1a98aa9f',
      name: 'Raphael',
      email: 'raphael@muuving.com.br'
    };
  }

  login(email: string, password: string): Observable<boolean> {
    let isUser: boolean = email == 'raphael@muuving.com.br' && password == 'casacor';

    if (isUser) {
      // Returned User if auth ok
      this.currentUser = {
        id: 'c11752b0-0475-4d31-9c01-223d1a98aa9f',
        name: 'Raphael',
        email: 'raphael@muuving.com.br'
      };

      // Two approaches
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
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
