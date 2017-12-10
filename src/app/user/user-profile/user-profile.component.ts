import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { conformToMask } from 'angular2-text-mask';
// import { default as cep, CEP } from 'cep-promise';
import { MzToastService } from 'ng2-materialize';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { AuthService } from '../../core/auth.service';
import { Profession } from '../../shared/profession.enum';
import { SpinnerService } from '../../core/spinner/spinner.service';
import { User } from '../../core/user';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
  selector: 'abx-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  professional;
  profProfileForm: FormGroup;
  profProfileFormHasChange: boolean;
  profProfileFormChangesSubscription: Subscription;
  celularMask = UtilsService.celularMask;
  cauMask = UtilsService.cauMask;
  cepMask = UtilsService.cepMask;
  fakePasswordHidden: string = '******';
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    // private profService: ProfessionalService,
    private toastService: MzToastService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() {
    // this.profService.getCurrentProfessional()
    //   .subscribe(prof => {
    //     this.professional = prof;
    //     this.profProfileForm = this.createUserProfileForm(this.professional);
    //     this.profProfileFormChangesSubscription = this.subscribeToFormChanges(this.profProfileForm, (formData) => {
    //       this.profProfileFormHasChange = true;
    //     });

    //     this.profProfileForm.get('CEP').valueChanges
    //       .takeUntil(this.ngUnsubscribe)
    //       .debounceTime(200)
    //       .subscribe((cep: string) => {
    //         let cleanCep = cep.replace(/\D/g, '');
    //         this.findLocationByCEP(cleanCep);
    //       });

    //     const cpfCnpjChange$ = this.profProfileForm.get('cpfCnpj').valueChanges;
    //     cpfCnpjChange$.debounceTime(250).subscribe((cpfCnpj: string) => {
    //       let cleanCpfCnpj = cpfCnpj.replace(/\D/g, '');

    //       let mask;

    //       if (cleanCpfCnpj.length < 12) {
    //         mask = UtilsService.cpfMask;
    //       } else {
    //         mask = UtilsService.cnpjMask;
    //       }

    //       let conformedCpfCnpj = conformToMask(cleanCpfCnpj, mask, {
    //         guide: false,
    //         placeholderChar: '\u2000'
    //       });

    //       this.profProfileForm.get('cpfCnpj').setValue(conformedCpfCnpj.conformedValue, {
    //         onlySelf: false,
    //         emitEvent: false
    //       })
    //     });

    //     this.profProfileForm.get('cpfCnpj').valueChanges
    //       .takeUntil(this.ngUnsubscribe)
    //       .debounceTime(250)
    //       .subscribe((cpfCnpj: string) => {
    //         let cleanCpfCnpj = cpfCnpj.replace(/\D/g, ''),
    //           mask;

    //         if (cleanCpfCnpj.length < 12) {
    //           mask = UtilsService.cpfMask;
    //         } else {
    //           mask = UtilsService.cnpjMask;
    //         }

    //         let conformedCpfCnpj = conformToMask(cleanCpfCnpj, mask, {
    //           guide: false,
    //           placeholderChar: '\u2000'
    //         });

    //         this.profProfileForm.get('cpfCnpj').setValue(conformedCpfCnpj.conformedValue, {
    //           onlySelf: false,
    //           emitEvent: false
    //         })
    //       });

    //   });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  saveProfile() {
    let errorMessage: string,
      error: boolean = false;

    this.spinnerService.toggleLoadingIndicator(true);

    this.professional.name = this.profProfileForm.value.name;
    this.professional.lastName = this.profProfileForm.value.lastName;
    this.professional.description = this.profProfileForm.value.description;
    this.professional.cpfCnpj = this.profProfileForm.value.cpfCnpj;
    this.professional.CAU = this.profProfileForm.value.CAU;
    this.professional.celular = this.profProfileForm.value.celular;
    this.professional.maritalStatus = this.profProfileForm.value.maritalStatus;
    this.professional.gender = this.profProfileForm.value.genderOpt;
    this.professional.addressArea = this.profProfileForm.value.addressArea;
    this.professional.addressNumber = this.profProfileForm.value.addressNumber;
    this.professional.profession = this.profProfileForm.value.professionOpt;
    this.professional.CEP = this.profProfileForm.value.CEP;

    if (this.profProfileForm.value.password !== this.fakePasswordHidden) {

      if (!this.profProfileForm.value.password.length) {
        errorMessage = 'Nova senha recusada'
        error = true;
      } else {

        this.professional.password = this.profProfileForm.value.password;
      }
    }

    // return this.profService
    //   .update(this.professional)
    //   .subscribe(resp => {
    //     this.spinnerService.toggleLoadingIndicator(false);
    //     this.profProfileFormHasChange = false;
    //     this.toastService.show('Dados atualizados!', 3000, 'green')
    //     if (error) {
    //       this.toastService.show(errorMessage, 3000, 'red')
    //     }
    //   });
  }

  private createUserProfileForm(prof): FormGroup {
    let description = prof.description ? prof.description : '';

    return this.fb.group({
      email: [{ value: prof.email, disabled: true }],
      password: [this.fakePasswordHidden],
      name: [prof.name],
      lastName: [prof.lastName],
      description: [description],
      cpfCnpj: [prof.cpfCnpj],
      CAU: [prof.CAU],
      celular: [prof.celular],
      maritalStatus: [prof.maritalStatus],
      genderOpt: [prof.gender],
      addressArea: [prof.addressArea],
      addressNumber: [prof.addressNumber],
      professionOpt: [prof.profession],
      CEP: [prof.CEP],
      showPassword: [false]
    });
  }

  private findLocationByCEP(cepCode: string | number) {
    if (String(cepCode).length < 8) {
      return;
    }

    this.profProfileForm.get('addressArea').disable();

    // cep(cepCode).then(CEP => {
    //   this.profProfileForm.get('addressArea').enable();
    //   this.profProfileForm.get('addressArea')
    //     .setValue(CEP.street, { onlySelf: false, emitEvent: false });
    //   Materialize.updateTextFields();

    // }).catch(e => {
    //   console.error(e);
    // });
  }

  private subscribeToFormChanges(form: FormGroup, doIt: (data?) => void, callback?: (data) => void): Subscription {
    const formChanges$ = form.valueChanges;

    return formChanges$.do(data => doIt(data)).debounceTime(3000).subscribe(data => {
      if (callback) callback(data)
    });
  }
}
