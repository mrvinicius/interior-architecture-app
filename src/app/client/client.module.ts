import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterializeModule } from 'ng2-materialize';

import { LayoutModule } from '../layout/layout.module';
import { ClientService } from './shared/client.service';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientComponent } from './client.component';

import { ClientRoutingModule } from './client-routing.module';
import { ClientModalComponent } from './client-modal/client-modal.component';
import { ClientEditorComponent } from './client-editor/client-editor.component';
import { ClientProfileComponent } from './client-profile/client-profile.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    MaterializeModule,
    ReactiveFormsModule,
    ClientRoutingModule,
  ],
  declarations: [
    ClientListComponent,
    ClientComponent,
    ClientModalComponent,
    ClientEditorComponent,
    ClientProfileComponent
  ],
  providers: [],
  entryComponents: [ClientModalComponent]
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
