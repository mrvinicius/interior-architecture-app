import { NgModule } from '@angular/core';

import { ClientsService } from './shared/clients.service';

import { ClientComponent } from './client.component';
import { ClientListComponent } from './client-list/client-list.component';

import { ClientRoutingModule } from './client-routing.module';

@NgModule({
  imports: [
    ClientRoutingModule
  ],
  declarations: [
    ClientComponent,
    ClientListComponent
  ],
  providers: [ClientsService]
})
export class ClientModule { }
