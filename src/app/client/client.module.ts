import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutModule } from '../layout/layout.module';
import { ClientService } from './shared/client.service';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientComponent } from './client.component';

import { ClientRoutingModule } from './client-routing.module';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,

    ClientRoutingModule
  ],
  declarations: [
    ClientListComponent,
    ClientComponent
  ],
  providers: []
})
export class ClientModule {
  constructor( @Optional() @SkipSelf() parentModule: ClientModule) {
    if (parentModule) {
      throw new Error(
        'ClientModule is already loaded. Import it in the AppModule only');
    }
  }
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ClientModule,
      // Add Services that should have only one instance - Singletons - App-wide
      providers: [
        ClientService
      ]
    };
  }
}
