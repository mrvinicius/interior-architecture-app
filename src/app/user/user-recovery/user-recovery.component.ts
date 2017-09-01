import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MzToastService } from 'ng2-materialize';

import { AuthService } from '../../core/auth.service';
import { ProfessionalService } from '../../core/professional.service';
import { SpinnerService } from '../../core/spinner/spinner.service';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'abx-user-recovery',
  templateUrl: './user-recovery.component.html',
  styleUrls: ['./user-recovery.component.scss']
})
export class UserRecoveryComponent implements OnInit {
  recoveryForm: FormGroup;
  errorMessage: string;


  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private profService: ProfessionalService,
    private spinnerService: SpinnerService,
    private toastService: MzToastService,
    private userService: UserService,
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  sendRequest(email: string) {
    console.log(email);

    // this.spinnerService.toggleLoadingIndicator(true);
    this.profService.sendResetRequest(email)
      .first()
      .subscribe(resp => {
        this.spinnerService.toggleLoadingIndicator(false);

        if (resp.hasError) {
          this.toastService.show(resp.errorMessage, 3000, 'red');
        } else {
          this.toastService.show('Link de redefinição de senha enviado para o seu email', 5000, 'green')
        }
      });
  }

  private createForm() {
    const emailPattern = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    this.recoveryForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(emailPattern)
      ]]
    });
  }

}
