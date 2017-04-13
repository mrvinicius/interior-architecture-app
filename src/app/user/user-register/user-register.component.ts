import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MzInputDirective,
  MzInputContainerComponent
} from 'ng2-materialize';

import { User } from '../shared/user';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {
  registerForm: FormGroup;

  createForm() {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() { }

  addNewUser() {
    if (this.registerForm.valid) {
      let values = this.registerForm.value;
      console.log(values);
      let user: User = { email: values.email, name: values.name };
      console.log(user);
      // this.userService.add();
    }

    // let user;
    // this.userService.add(user);
  }
}
