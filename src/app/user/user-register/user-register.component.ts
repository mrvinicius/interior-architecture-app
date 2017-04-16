import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import {
  MzInputDirective,
  MzInputContainerComponent
} from 'ng2-materialize';

import { User } from '../shared/user';
import { UserService } from '../shared/user.service';
import { SpinnerService } from '../../core/spinner/spinner.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string;

  createForm() {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinnerService: SpinnerService,
    private userService: UserService,
  ) {
    this.createForm();
  }

  ngOnInit() { }

  addUser() {
    if (this.registerForm.valid) {
      this.spinnerService.toggleLoadingIndicator(true);

      let values = this.registerForm.value;
      let user: User = { email: values.email, name: values.name };

      this.userService.add(user).subscribe(
        response => {
          this.spinnerService.toggleLoadingIndicator(false);
          if (response.HasError) {
            this.errorMessage = response.ErrorMessage;
          } else {
            this.router.navigate(['quase']);
          }
        },
        error => {
          this.spinnerService.toggleLoadingIndicator(false);
          console.log(error)
        }
      );
    } else {
      return;
    }
  }
}
