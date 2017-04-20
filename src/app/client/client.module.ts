import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientService } from './shared/client.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    ClientService
  ]
})
export class ClientModule { }
