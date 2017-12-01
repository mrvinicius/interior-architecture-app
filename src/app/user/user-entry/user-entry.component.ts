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
          if (resObj.HasError) {
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
            this.router.navigate(['/orcamentos']);
          }

        });
    }
  }

  private createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
