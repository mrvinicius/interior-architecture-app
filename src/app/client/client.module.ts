import { NgModule } from '@angular/core';
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
  providers: [
    ClientService
  ]
})
export class ClientModule { }
