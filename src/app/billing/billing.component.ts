import { Component, OnInit } from '@angular/core';
import { MzModalService } from 'ng2-materialize';

import { BillingModalComponent } from './billing-modal/billing-modal.component';
import { ProfessionalService } from './../core/professional.service';

@Component({
  selector: 'abx-billing',
  templateUrl: './billing.component.html'
  //   template: `
  //   <abx-layout>
  //     <router-outlet id="billingRouter"></router-outlet>
  //   </abx-layout>
  // `
})
export class BillingComponent implements OnInit {
  paying: boolean;

  constructor(
    private profService: ProfessionalService,
    private modalService: MzModalService,
  ) {
    console.log(this.profService.professional);
    this.profService.getCurrentProfessional()
      .subscribe(prof => this.paying = prof.paying)
    // this.paying = false;

  }

  ngOnInit() {}

  openBillingModal() {
    let modalRef = this.modalService.open(BillingModalComponent, {});
  }

}
