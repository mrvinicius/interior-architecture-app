import { SpinnerService } from './../../core/spinner/spinner.service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { AuthService } from '../../core/auth.service';
import { Profession } from './../../shared/profession.enum';
import { Professional } from './../../core/professional';
import { ProfessionalService } from './../../core/professional.service';
import { User } from '../../core/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  professional: Professional;
  profProfileForm: FormGroup;
  profProfileFormHasChange: boolean;
  profProfileFormChangesSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private profService: ProfessionalService,
    private fb: FormBuilder,
    private spinnerService: SpinnerService
  ) {

  }

  ngOnInit() {
    this.profService.getCurrentProfessional().subscribe(prof => {
      this.professional = prof;
      this.profProfileForm = this.createUserProfileForm(this.professional);
      console.log(this.professional);
      
      this.profProfileFormChangesSubscription = this.subscribeToFormChanges(this.profProfileForm, (formData) => {
        this.profProfileFormHasChange = true;
      });


    });
  }

  saveProfile() {
    this.spinnerService.toggleLoadingIndicator(true);

    this.professional.name = this.profProfileForm.value.name;
    this.professional.description = this.profProfileForm.value.description;
    this.professional.cpfCnpj = this.profProfileForm.value.cpfCnpj;
    this.professional.rg = this.profProfileForm.value.rg;
    this.professional.CAU = this.profProfileForm.value.cau;
    this.professional.celular = this.profProfileForm.value.celular;
    this.professional.maritalStatus = this.profProfileForm.value.maritalStatus;
    this.professional.gender = this.profProfileForm.value.genderOpt;
    this.professional.address = this.profProfileForm.value.professionOpt;
    this.professional.profession = this.profProfileForm.value.professionOpt;

    return this.profService.update(this.professional).subscribe(resp => {
      this.spinnerService.toggleLoadingIndicator(false);
      this.profProfileFormHasChange = false;

    });
  }

  private createUserProfileForm(prof: Professional): FormGroup {
    return this.fb.group({
      name: [prof.name],
      description: [prof.description],
      cpfCnpj: [prof.cpfCnpj],
      rg: [prof.rg],
      cau: [prof.CAU],
      celular: [prof.celular],
      maritalStatus: [prof.maritalStatus],
      genderOpt: [prof.gender],
      address: [prof.address],
      professionOpt: [prof.profession],

      // showPassword: [false]
    });
  }

  private subscribeToFormChanges(form: FormGroup, doIt: (data?) => void, callback?: (data) => void): Subscription {
    const formChanges$ = form.valueChanges;

    return formChanges$.do(data => doIt(data)).debounceTime(3000).subscribe(data => {
      if (callback) callback(data)
    });
  }
}
