import { SpinnerService } from './../../core/spinner/spinner.service';
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
import { ProfessionalService } from '../../core/professional.service';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
  selector: 'abx-billing-modal',
  templateUrl: './billing-modal.component.html',
  styleUrls: ['./billing-modal.component.scss']
})
export class BillingModalComponent extends MzBaseModal implements OnInit {
  billingForm: FormGroup;
  cardNumberMask = UtilsService.creditCardNumberMask;
  errorMessages: string[];
  expirationDatePipe = createAutoCorrectedDatePipe('mm/yy');
  expirationDateMask = [/\d/, /\d/, '/', /\d/, /\d/];
  cvcMask = UtilsService.cardVerificationCode;

  constructor(
    private billingService: BillingService,
    private fb: FormBuilder,
    private profService: ProfessionalService,
    private spinnerService: SpinnerService
  ) {
    super();
    this.billingForm = this.createBillingForm();
  }

  ngOnInit() {

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

    console.log(billingInfo);

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
    console.log(this.profService.professional);
    
    this.profService.update(this.profService.professional).subscribe(resp => {
      console.log(resp);

      if (resp.HasError) {

      } else {
        this.billingService.billingInfoUpdated(true);
        this.modalComponent.close();
      }

    })
  }

  private createBillingForm(): FormGroup {
    return this.fb.group({
      cardNumber: ['', Validators.required],
      expirationDate: ['', Validators.required],
      CVC: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      planIdentifier: ['plano_mensal', Validators.required]
    })
  }

}
