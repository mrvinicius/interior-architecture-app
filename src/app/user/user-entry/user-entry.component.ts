import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import {
  MzInputDirective,
  MzInputContainerComponent
} from 'ng2-materialize';

import { UserService } from '../shared/user.service';
import { SpinnerService } from '../../core/spinner/spinner.service';

@Component({
  selector: 'app-user-entry',
  templateUrl: './user-entry.component.html',
  styleUrls: ['./user-entry.component.scss']
})
export class UserEntryComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
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

  login() {
    if (this.loginForm.valid) {
      this.spinnerService.toggleLoadingIndicator(true);

      let values = this.loginForm.value;

      // this.userService.auth(values.email, values.password).subscribe(
      //   response => {
      //     this.spinnerService.toggleLoadingIndicator(false);
      //   },
      //   error => {
      //     this.spinnerService.toggleLoadingIndicator(false);
      //     console.log(error);
      //   }
      // );

      this.userService.auth(values.email, values.password)
        .then(response => {
          console.log(response)
          if (response && response.user) {
            this.spinnerService.toggleLoadingIndicator(false);
          } else {
            this.spinnerService.toggleLoadingIndicator(false);
            this.errorMessage = "Dados incorretos."
            // email nao cadastrado
            // senha incorreta
            // outros erros
          }
        })
        .catch();
    } else {
      return;
    }
  }

  searchUser(email: string) {

  }
}
