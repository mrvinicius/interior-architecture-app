import {
  ModuleWithProviders, NgModule,
  Optional, SkipSelf
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MaterializeModule } from 'ng2-materialize';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { NoAuthGuard } from './no-auth.guard';
import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerService } from './spinner/spinner.service';
import { WindowRef } from './window-ref.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MaterializeModule.forRoot()
  ],
  declarations: [
    SpinnerComponent
  ],
  exports: [
    SpinnerComponent
  ],
  providers: [],
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      // Add Services that should have only one instance - Singletons - App-wide
      providers: [
        AuthGuard,
        AuthService,
        CanDeactivateGuard,
        NoAuthGuard,
        SpinnerService,
        WindowRef
      ]
    };
  }
}
