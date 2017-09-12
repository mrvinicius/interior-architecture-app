import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from "@angular/router";
import {
  MzInputDirective,
  MzInputContainerComponent
} from 'ng2-materialize';

import { AuthService } from '../../core/auth.service';
import { ProfessionalService } from '../../core/professional.service';
import { SpinnerService } from '../../core/spinner/spinner.service';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'abx-user-entry',
  templateUrl: './user-entry.component.html',
  styleUrls: ['./user-entry.component.scss']
})
export class UserEntryComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private spinnerService: SpinnerService,
    private profService: ProfessionalService
  ) {
    this.createForm();
  }

  ngOnInit() { }

  login() {
    if (this.loginForm.invalid) {
      return;
    } else {
      let values = this.loginForm.value;

      this.errorMessage = '';
      this.spinnerService.toggleLoadingIndicator(true);
      this.profService.login(values.email, values.password)
        .subscribe(resObj => {
          this.spinnerService.toggleLoadingIndicator(false);
          // if (resObj.HasError) {
          if (resObj.HasError) {
            // TODO: implement correct feedbacks
            // email nao cadastrado
            // senha incorreta
            // outros erros
            switch (resObj.ErrorMessage) {
              case "Email não cadastrado":
                this.errorMessage = resObj.ErrorMessage
                break;
              case "Senha incorreta":
                this.errorMessage = resObj.ErrorMessage
                break;
              case "Usuário não validado":
                this.errorMessage = "Confirme seu cadastro por email"
                break;
              case "Login não encontrado":
                this.errorMessage = "Email não cadastrado"
                break;
              default:
                this.errorMessage = "Houve um problema desconhecido"
                break;
            }

          } else {
            this.router.navigate(['/projetos']);
          }

          console.log(resObj);
        });
    }
  }

  searchUser(email: string) {

  }

  private createForm() {
    const emailPattern = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(emailPattern)
      ]],
      password: ['', Validators.required]
    });
  }
}
