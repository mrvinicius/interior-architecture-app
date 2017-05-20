import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { AuthService } from '../../core/auth.service';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'mbx-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.scss']
})
export class UserPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  errorMessage: string;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  definePassword() {

  }

  private createForm() {
    this.passwordForm = this.fb.group({
      password: ['', Validators.required],
      showPassword: [false]
      // passwordConfirm: ['', Validators.required]
    });
  }
}
