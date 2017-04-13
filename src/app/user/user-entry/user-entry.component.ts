import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MzInputDirective,
  MzInputContainerComponent
} from 'ng2-materialize';

@Component({
  selector: 'app-user-entry',
  templateUrl: './user-entry.component.html',
  styleUrls: ['./user-entry.component.scss']
})
export class UserEntryComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  });

  constructor() { }

  errorMessage(): void {

  }

  ngOnInit() { }


  login(e: Event) {
    e.preventDefault();
  }

  searchUser(email: string) {

  }

}
