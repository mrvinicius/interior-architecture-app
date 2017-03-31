import { Injectable } from '@angular/core';

import { User } from './user';
import { currentUser } from './mock-user'

@Injectable()
export class UserService {

  constructor() { }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('currentUser')) as User;
  }

  setCurrentUser(user: User): void {
    // update data source

    // update current storaged user
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

}
