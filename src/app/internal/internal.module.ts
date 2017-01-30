import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternalComponent } from './internal.component';
import { InternalRoutingModule } from './internal-routing.module';

// import { ClientModule } from './client/client.module';

@NgModule({
  imports: [
    CommonModule,
    // ClientModule,
    InternalRoutingModule
  ],
  declarations: [
    InternalComponent
  ]
})
export class InternalModule { }
