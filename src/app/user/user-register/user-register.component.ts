import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import {
  MzInputDirective,
  MzInputContainerComponent
} from 'ng2-materialize';

import { Professional } from '../../core/professional';
import { ProfessionalService } from '../../core/professional.service';
import { SpinnerService } from '../../core/spinner/spinner.service';
@Component({
  selector: 'mbx-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinnerService: SpinnerService,
    private profService: ProfessionalService
  ) {
    this.createForm();
  }

  addUser() {
    if (this.registerForm.invalid) {
      return;
    } else {
      this.spinnerService.toggleLoadingIndicator(true);
      let values = this.registerForm.value;
      let prof: Professional = new Professional(values.name, values.email);

      this.profService.add(prof, true)
        .subscribe(response => {
          this.spinnerService.toggleLoadingIndicator(false);
          if (response.HasError) {
            this.errorMessage = response.ErrorMessage;
          } else {
            this.router.navigate(['quase-la']);
          }
        }, (error) => {
          this.spinnerService.toggleLoadingIndicator(false);
          console.error(error)
        }
        );
    }
  }

  createForm() {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  ngOnInit() { }
}
