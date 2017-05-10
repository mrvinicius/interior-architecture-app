import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import {
  MzInputDirective,
  MzInputContainerComponent
} from 'ng2-materialize';

import { AuthService } from '../../core/auth.service';
import { SpinnerService } from '../../core/spinner/spinner.service';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'mbx-user-entry',
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
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private spinnerService: SpinnerService,
    private userService: UserService,
  ) {
    this.createForm();
  }

  ngOnInit() { }

  login() {
    if (this.loginForm.invalid) {
      return;
    } else {
      let values = this.loginForm.value;

      this.spinnerService.toggleLoadingIndicator(true);

      this.auth.login(values.email, values.password).subscribe(
        result => {
          this.spinnerService.toggleLoadingIndicator(false);

          if (result) {
            this.router.navigate(['/projetos']);
          } else {
            this.errorMessage = "Dados incorretos"

            // TODO: implement correct feedbacks
            // email nao cadastrado
            // senha incorreta
            // outros erros
          }
        }
      );
    }
  }

  searchUser(email: string) {

  }
}
