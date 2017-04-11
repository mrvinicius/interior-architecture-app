import { Injectable } from '@angular/core';
import { currentUser, users } from './user/shared/mock-user';

@Injectable()
export class AuthService {
  constructor() { }

  public authenticated() { }

  public login(email, password) {
    if (currentUser.email == email && currentUser.password == password) {
     return true; 
    } else {
     return false;
    }
  }

  public logout() {
    localStorage.removeItem('id_token');
  }
}
