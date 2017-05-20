import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankService } from './shared/bank.service';
import { BankAccountService } from './shared/bank-account.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class FinancialModule {
  constructor( @Optional() @SkipSelf() parentModule: FinancialModule) {
    if (parentModule) {
      throw new Error(
        'FinancialModule is already loaded. Import it in the AppModule only');
    }
  }
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FinancialModule,
      // Add Services that should have only one instance - Singletons - App-wide
      providers: [
        BankAccountService,
        BankService
      ]
    };
  }
}
