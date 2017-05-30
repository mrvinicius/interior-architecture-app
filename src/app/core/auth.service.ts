import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { User } from './user';
import { Professional } from './professional';

@Injectable()
export class AuthService {
  private currentUser: User;
  // public token: string;
  // public currentUser: Professional;

  // isLoggedIn: boolean = false;
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(
    private http: Http,
    private router: Router
  ) {
    
    // this.currentUser = {
    //   id: 'c11752b0-0475-4d31-9c01-223d1a98aa9f',
    //   name: 'Raphael',
    //   email: 'raphael@muuving.com.br'
    // };
    console.log(localStorage.getItem('currentUser'));

  }

  getCurrentUser(): User {
    if (this.currentUser === undefined) {
      let userData: any = JSON.parse(localStorage.getItem('currentUser'));
      let user: User = new User(userData.name, userData.email, userData.id);
      return user;
    } else {
      return this.currentUser;
    }
  }

  setCurrentUser(user: User): void {
    let userData: any = {
      id: user.id,
      name: user.name,
      email: user.email
    }

    this.currentUser = new User(userData.name, userData.email, userData.id);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }

  login(user: User) {
    console.log(user);

    this.setCurrentUser(user);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  // login(email: string, password: string): Observable<boolean> {
  //   let isUser: boolean = email == 'raphael@muuving.com.br' && password == 'casacor';

  //   if (isUser) {
  //     // Returned User if auth ok
  //     this.currentUser = {
  //       id: 'c11752b0-0475-4d31-9c01-223d1a98aa9f',
  //       name: 'Raphael',
  //       email: 'raphael@muuving.com.br'
  //     };

  //     // Two approaches
  //     localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  //     this.isLoggedIn = true;
  //   }

  //   return Observable.of(isUser).delay(1000).do(val => this.isLoggedIn = true);
  // }


}
