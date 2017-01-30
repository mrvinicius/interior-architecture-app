import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientComponent } from './client.component';
import { ClientListComponent } from './client-list/client-list.component';

import { ClientRoutingModule } from './client-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ClientRoutingModule
  ],
  declarations: [
    ClientComponent,
    ClientListComponent
  ]
})
export class ClientModule { }
