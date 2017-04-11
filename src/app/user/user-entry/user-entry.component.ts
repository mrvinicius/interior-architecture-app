import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MzInputDirective,
  MzInputContainerComponent
} from 'ng2-materialize';

import { AuthService } from '../../core/auth.service';
import { UserService } from '../../core/user/shared/user.service';

@Component({
  selector: 'app-user-entry',
  templateUrl: './user-entry.component.html',
  styleUrls: ['./user-entry.component.scss']
})
export class UserEntryComponent implements OnInit {
  email = new FormControl();
  password = new FormControl();

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() { }

  tryAccess(e: Event) {
    e.preventDefault();

  }

  errorMessage(): void {

  }
}
