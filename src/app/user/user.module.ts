import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MdlModule,
  MdlButtonModule,
  MdlTextFieldModule,
} from 'angular2-mdl';
import { FlexLayoutModule } from '@angular/flex-layout';
import { 
  MaterializeModule
} from 'ng2-materialize';

import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';

import { UserService } from './shared/user.service';

import { UserComponent } from './user.component';
import { UserEntryComponent } from './user-entry/user-entry.component';

@NgModule({
  imports: [
    SharedModule,
    FlexLayoutModule,
    MdlButtonModule,
    MdlTextFieldModule,
    MaterializeModule,
    ReactiveFormsModule,

    UserRoutingModule
  ],
  declarations: [
    UserComponent,
    UserEntryComponent,
  ],
  providers: [
    UserService
  ]
})
export class UserModule {}
