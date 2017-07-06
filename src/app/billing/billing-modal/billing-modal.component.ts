import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MzModalService, MzBaseModal } from "ng2-materialize";
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
  errorMessages: string[];
  expirationDatePipe = createAutoCorrectedDatePipe('mm/yy');
  expirationDateMask = [/\d/, /\d/, '/', /\d/, /\d/];
  professional: Professional;

  constructor(
    private billingService: BillingService,
    private fb: FormBuilder,
    private profService: ProfessionalService,
    private spinnerService: SpinnerService
  ) {
    super();

  }

  ngOnInit() {
    this.profService.getCurrentProfessional()
      .subscribe(prof => {
        this.professional = prof;
        this.billingForm = this.createBillingForm(this.professional)
      });
  }

  saveBillingInfo(formData) {
    this.spinnerService.toggleLoadingIndicator(true);
    this.errorMessages = [];
    console.log(formData);

    let cardNumber: string = formData.cardNumber.replace(/ /g, '');
    let dateSlashIndex = formData.expirationDate.indexOf('/');
    let month: number = Number(formData.expirationDate.substr(0, dateSlashIndex));
    let year: number = Number("20" + formData.expirationDate.substr(dateSlashIndex + 1, ));
    let CVC: number = Number(formData.CVC);

    let billingInfo: BillingInfo = {
      professionalId: this.profService.professional.id,
      description: 'Assinatura',
      planIdentifier: formData.planIdentifier,
      firstName: formData.firstName,
      lastName: formData.lastName,
      creditCardInfo: {
        number: cardNumber,
        expirationMonth: month,
        expirationYear: year,
        cvc: CVC
      }
    }

    this.billingService.addBillingInfo(billingInfo).subscribe(resp => {
      this.spinnerService.toggleLoadingIndicator(false);

      if (resp.HasError) {
        this.errorMessages = resp.errorMessages;
        return;
      } else {
        this.profService.professional.paying = true;
        this.updateProfessional();
      }
    });
  }

  updateProfessional() {
    this.profService.update(this.profService.professional).subscribe(resp => {
      if (resp.HasError) {

      } else {
        this.billingService.billingInfoUpdated(true);
        this.modalComponent.close();
      }

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
        Validators.pattern(/^[0-9]{3,4}$/)
      ]],
      firstName: [prof.name, Validators.required],
      lastName: [lastName, Validators.required]
    })
  }

}
