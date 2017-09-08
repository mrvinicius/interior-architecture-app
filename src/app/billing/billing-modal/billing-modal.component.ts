import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { conformToMask } from 'angular2-text-mask';
import { default as cep, CEP } from 'cep-promise';
import { MzModalService, MzBaseModal, MzToastService } from "ng2-materialize";
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

import { BillingInfo } from '../shared/billing-info';
import { BillingService } from '../shared/billing.service';
import { Professional } from './../../core/professional';
import { ProfessionalService } from '../../core/professional.service';
import { SpinnerService } from '../../core/spinner/spinner.service';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
  selector: 'abx-billing-modal',
  templateUrl: './billing-modal.component.html',
  styleUrls: ['./billing-modal.component.scss']
})
export class BillingModalComponent extends MzBaseModal implements OnInit {
  billingForm: FormGroup;
  cardNumberMask = UtilsService.creditCardNumberMask;
  cvcMask = UtilsService.cardVerificationCode;
  cepMask = UtilsService.cepMask;
  errorMessages: string[];
  expirationDatePipe = createAutoCorrectedDatePipe('mm/yy');
  expirationDateMask = [/\d/, /\d/, '/', /\d/, /\d/];
  professional: Professional;
  validCep: boolean = false;

  constructor(
    private billingService: BillingService,
    private fb: FormBuilder,
    private profService: ProfessionalService,
    private spinnerService: SpinnerService,
    private toastService: MzToastService
  ) {
    super();
  }

  handleCEP(cepCode: string) {
    if (String(cepCode).length < 8) {
      this.validCep = false;
      return;
    }

    cep(cepCode).then(CEP => {
      this.validCep = true;
    }).catch(e => this.validCep = false)
  }

  ngOnInit() {
    this.profService.getCurrentProfessional()
      .subscribe(prof => {
        this.professional = prof;
        this.billingForm = this.createBillingForm(this.professional);

        this.billingForm.get('CEP').valueChanges
          .do(() => this.validCep = false)
          .debounceTime(200)
          .subscribe((cep: string) => {
            let cleanCep = cep.replace(/\D/g, '');
            this.handleCEP(cleanCep);
          });

        this.billingForm.get('cpfCnpj').valueChanges
          .debounceTime(250)
          .subscribe((cpfCnpj: string) => {
            let cleanCpfCnpj = cpfCnpj.replace(/\D/g, ''),
              mask;

            if (cleanCpfCnpj.length < 12) {
              mask = UtilsService.cpfMask;
            } else {
              mask = UtilsService.cnpjMask;
            }

            let conformedCpfCnpj = conformToMask(cleanCpfCnpj, mask, {
              guide: false,
              placeholderChar: '\u2000'
            });

            this.billingForm.get('cpfCnpj').setValue(conformedCpfCnpj.conformedValue, {
              onlySelf: false,
              emitEvent: false
            })
          });
      });
  }

  saveBillingInfo(formData) {
    let billingInfo: BillingInfo;

    this.spinnerService.toggleLoadingIndicator(true);
    this.errorMessages = [];
    console.log(formData);

    let cardNumber: string = formData.cardNumber.replace(/ /g, '');
    let dateSlashIndex = formData.expirationDate.indexOf('/');
    let month: number = Number(formData.expirationDate.substr(0, dateSlashIndex));
    let year: number = Number("20" + formData.expirationDate.substr(dateSlashIndex + 1, ));
    let CVC: number = Number(formData.CVC);

    if (Boolean(formData.cpfCnpj)) {
      if (formData.cpfCnpj.trim().length !== 14
        && formData.cpfCnpj.trim().length !== 18) {
        this.spinnerService.toggleLoadingIndicator(false);
        this.errorMessages.push('Digite um CPF ou CNPJ válido');
        return;
      }
    } else {
      this.spinnerService.toggleLoadingIndicator(false);
      this.errorMessages.push('Informe um CPF ou CNPJ');
      return;
    }

    if (Boolean(formData.CEP)) {
      console.log(formData.CEP);

      if (formData.CEP.trim().length !== 9) {
        this.spinnerService.toggleLoadingIndicator(false);
        this.errorMessages.push('Digite um CEP válido');
        return;
      }
    } else {
      this.spinnerService.toggleLoadingIndicator(false);
      this.errorMessages.push('Informe o CEP');
      return;
    }

    billingInfo = {
      professionalId: this.profService.professional.id,
      description: 'Assinatura',
      planIdentifier: formData.planIdentifier,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      creditCardInfo: {
        number: cardNumber,
        expirationMonth: month,
        expirationYear: year,
        cvc: CVC
      }
    }

    this.profService.professional.cpfCnpj = formData.cpfCnpj;
    this.profService.professional.CEP = formData.CEP;
    this.profService.professional.addressNumber = formData.addressNumber;
    this.profService.professional.paying = true;
    this.profService.update(this.profService.professional)
      .subscribe(resp => {
        if (resp.HasError) {
          this.spinnerService.toggleLoadingIndicator(false);
        } else {
          this.updateBilling(billingInfo)
        }
      })
  }

  updateBilling(billingInfo: BillingInfo) {
    this.billingService.addBillingInfo(billingInfo)
      .subscribe(resp => {
        this.spinnerService.toggleLoadingIndicator(false);

        if (resp.HasError) {
          this.errorMessages = resp.errorMessages;
          this.cancelBilling();
        } else {
          this.toastService.show('Pronto! Agora você é um assinante', 3000, 'green');
          this.billingService.billingInfoUpdated(true);
          this.modalComponent.close();
        }
      })
  }

  cancelBilling() {
    this.profService.professional.paying = false;
    this.profService.update(this.profService.professional)
      .subscribe(resp => {
        this.spinnerService.toggleLoadingIndicator(false);
      })
  }

  private createBillingForm(prof: Professional): FormGroup {
    let lastName: string = '';

    if (prof.lastName != undefined && prof.lastName.length > 0)
      lastName = prof.lastName;

    return this.fb.group({
      planIdentifier: ['plano_mensal', Validators.required],
      cardNumber: ['', [
        Validators.required,
        Validators.pattern(/^(\d{4}[- ]){3}\d{4}|\d{16}$/)
      ]],
      expirationDate: ['', [
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/)
      ]],
      CVC: ['', [
        Validators.required,
        Validators.pattern(/^([0-9]{3,4})|^([0-9]\s)/)
      ]],
      firstName: [prof.name, Validators.required],
      lastName: [lastName, Validators.required],
      cpfCnpj: [prof.cpfCnpj, Validators.required],
      CEP: [prof.CEP, Validators.required],
      addressNumber: [prof.addressNumber, Validators.required]

    })
  }

}
