import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterializeModule } from 'ng2-materialize';

import { BankService } from './shared/bank.service';
import { BankAccountService } from './shared/bank-account.service';
import { BillingComponent } from './billing.component';
import { BillingRoutingModule } from './billing-routing.module';
import { BillingService } from './shared/billing.service';
import { LayoutModule } from '../layout/layout.module';
import { BillingModalComponent } from './billing-modal/billing-modal.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    LayoutModule,
    MaterializeModule,
    ReactiveFormsModule,
    BillingRoutingModule
  ],
  declarations: [
    BillingComponent,
    BillingModalComponent
  ],
  entryComponents: [
    BillingModalComponent
  ]
})
export class BillingModule {
  constructor( @Optional() @SkipSelf() parentModule: BillingModule) {
    if (parentModule) {
      throw new Error(
        'BillingModule is already loaded. Import it in the AppModule only');
    }
  }
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BillingModule,
      // Add Services that should have only one instance - Singletons - App-wide
      providers: [
        BankAccountService,
        BankService,
        BillingService
      ]
    };
  }
}
