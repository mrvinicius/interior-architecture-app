import { SignupModalComponent } from './signup-modal.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MzModalService } from 'ng2-materialize';

import { Professional } from '../core/professional';
import { ProfessionalService } from '../core/professional.service';
import { SpinnerService } from '../core/spinner/spinner.service';

@Component({
  selector: 'abx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: MzModalService,
    private spinnerService: SpinnerService,
    private profService: ProfessionalService
  ) {
    this.registerForm = this.createForm();
  }

  addUser() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Preencha todos os campos'
      return;
    } else {
      this.errorMessage = undefined;
      this.spinnerService.toggleLoadingIndicator(true);
      let values = this.registerForm.value;
      let prof: Professional =
        new Professional(values.name, values.email);

      this.profService.add(prof, true)
        .subscribe(response => {
          this.spinnerService.toggleLoadingIndicator(false);


          if (response.hasError) {
            this.errorMessage = response.errorMessage;
          } else {
            this.router.navigate(['quase-la']);
          }
        });
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    $('.scrollspy').scrollSpy();
  }

  openSignupModal() {
    let modalRef = this.modalService.open(SignupModalComponent, {});

  }

}
