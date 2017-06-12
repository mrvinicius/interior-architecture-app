import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { conformToMask } from 'angular2-text-mask';
import { default as cep, CEP } from 'cep-promise';

import { AuthService } from '../../core/auth.service';
import { Profession } from '../../shared/profession.enum';
import { Professional } from '../../core/professional';
import { ProfessionalService } from '../../core/professional.service';
import { SpinnerService } from '../../core/spinner/spinner.service';
import { User } from '../../core/user';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
  selector: 'abx-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  professional: Professional;
  profProfileForm: FormGroup;
  profProfileFormHasChange: boolean;
  profProfileFormChangesSubscription: Subscription;
  celularMask = UtilsService.celularMask;
  cauMask = UtilsService.cauMask;
  cepMask = UtilsService.cepMask;
  addressFieldsDisabled: boolean = false;

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
      console.log(this.profProfileForm.value.professionOpt);

      console.log(this.professional);

      this.profProfileFormChangesSubscription = this.subscribeToFormChanges(this.profProfileForm, (formData) => {
        this.profProfileFormHasChange = true;
      });

      const cepChange$ = this.profProfileForm.get('CEP').valueChanges;
      cepChange$.debounceTime(200).subscribe((cep: string) => {
        let cleanCep = cep.replace(/\D/g, '');
        this.findLocationByCEP(cleanCep);
      });

      const cpfCnpjChange$ = this.profProfileForm.get('cpfCnpj').valueChanges;
      cpfCnpjChange$.debounceTime(250).subscribe((cpfCnpj: string) => {
        // console.log('cpfCnpj', cpfCnpj);
        let cleanCpfCnpj = cpfCnpj.replace(/\D/g, '');

        let mask;

        if (cleanCpfCnpj.length < 12) {
          mask = UtilsService.cpfMask;
        } else {
          mask = UtilsService.cnpjMask;
        }

        let conformedCpfCnpj = conformToMask(cleanCpfCnpj, mask, {
          guide: false,
          placeholderChar: '\u2000'
        });


        // console.log('conformedCpfCnpj', conformedCpfCnpj);

        // console.log(!(/\D/).test(cpfCnpj.slice(-1)));

        // if (!(/\D/).test(cpfCnpj.slice(-1))) {
        //   console.log('mask!');

        this.profProfileForm.get('cpfCnpj').setValue(conformedCpfCnpj.conformedValue, {
          onlySelf: false,
          emitEvent: false,
          // keepCharPositions: true
        })

        // }


      });

    });
  }

  saveProfile() {
    this.spinnerService.toggleLoadingIndicator(true);

    this.professional.name = this.profProfileForm.value.name;
    this.professional.description = this.profProfileForm.value.description;
    this.professional.cpfCnpj = this.profProfileForm.value.cpfCnpj;
    // this.professional.rg = this.profProfileForm.value.rg;
    this.professional.CAU = this.profProfileForm.value.CAU;
    this.professional.celular = this.profProfileForm.value.celular;
    this.professional.maritalStatus = this.profProfileForm.value.maritalStatus;
    this.professional.gender = this.profProfileForm.value.genderOpt;
    this.professional.addressArea = this.profProfileForm.value.addressArea;
    this.professional.addressNumber = this.profProfileForm.value.addressNumber;
    this.professional.profession = this.profProfileForm.value.professionOpt;
    this.professional.CEP = this.profProfileForm.value.CEP;

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
      // rg: [prof.rg],
      CAU: [prof.CAU],
      celular: [prof.celular],
      maritalStatus: [prof.maritalStatus],
      genderOpt: [prof.gender],
      addressArea: [prof.addressArea],
      addressNumber: [prof.addressNumber],
      professionOpt: [prof.profession],
      CEP: [prof.CEP],


      // showPassword: [false]
    });
  }

  private findLocationByCEP(cepCode: string | number) {
    if (String(cepCode).length < 8) {
      return;
    }

    this.addressFieldsDisabled = true;

    cep(cepCode).then(CEP => {
      this.addressFieldsDisabled = false;
      this.profProfileForm.get('addressArea')
        .setValue(CEP.street, { onlySelf: false, emitEvent: false });
      Materialize.updateTextFields();

    }).catch(e => {
      console.log(e);
    });
  }

  private subscribeToFormChanges(form: FormGroup, doIt: (data?) => void, callback?: (data) => void): Subscription {
    const formChanges$ = form.valueChanges;

    return formChanges$.do(data => doIt(data)).debounceTime(3000).subscribe(data => {
      if (callback) callback(data)
    });
  }
}
