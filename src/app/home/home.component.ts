import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MzModalService } from 'ng2-materialize';
import { Subject } from 'rxjs/Subject';

import { Professional } from '../core/professional';
import { ProfessionalService } from '../core/professional.service';
import { SignupModalComponent } from './signup-modal.component';
import { SpinnerService } from '../core/spinner/spinner.service';

@Component({
  selector: 'abx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  errorMessage: string;
  fromArchathon: boolean;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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
      let values = this.registerForm.value,
        prof: Professional = new Professional(values.name, values.email);

      this.errorMessage = undefined;
      this.spinnerService.toggleLoadingIndicator(true);
      this.profService.add(prof, true)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(response => {
          this.spinnerService.toggleLoadingIndicator(false);

          if (response.hasError) {
            this.errorMessage = response.errorMessage;
          } else {
            (<any>window).Intercom('update', {
              email: this.registerForm.value.email,
              name: this.registerForm.value.name
            });

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
    this.route.queryParams
      .takeUntil(this.ngUnsubscribe)
      .subscribe(params => {
        this.fromArchathon = params['archathon'];

        if (this.fromArchathon) {
        }
      })

    $('.scrollspy').scrollSpy();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  openSignupModal() {
    let modalRef = this.modalService.open(SignupModalComponent, {});
  }

}
