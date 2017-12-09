import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../core/auth.service';
import { SpinnerService } from './../../core/spinner/spinner.service';

@Component({
  selector: 'abx-user-profession',
  templateUrl: './user-profession.component.html',
  styleUrls: ['./user-profession.component.scss']
})
export class UserProfessionComponent implements OnInit {
  professionForm: FormGroup;
  errorMessage: string;
  id: string;
  email: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService: SpinnerService
  ) {
    this.createForm();
  }

  difineProfession() {
    this.spinnerService.toggleLoadingIndicator(true);

    // this.professional.profession = this.professionForm.value.professionOpt;
    // this.profService.update(this.professional).subscribe(resp => {
    //   this.spinnerService.toggleLoadingIndicator(false);
    //   // this.router.navigate(['/projetos']);
    // });
  }

  ngOnInit() {
    this.spinnerService.toggleLoadingIndicator(true);
    // this.route.queryParams.subscribe(params => {
    //   this.id = this.profService.professional.id;
    //   this.email = this.profService.professional.email;

    //   this.getCurrentProf();
    // })
  }

  getCurrentProf() {
    // this.profService.getCurrentProfessional().subscribe((prof: Professional) => {
    //   this.professional = prof
    //   this.spinnerService.toggleLoadingIndicator(false);
    // });
  }

  private createForm() {
    this.professionForm = this.fb.group({
      professionOpt: ['', Validators.required]
    });
  }
}
