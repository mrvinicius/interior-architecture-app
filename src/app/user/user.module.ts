import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MdlModule,
  MdlButtonModule,
  MdlTextFieldModule,
} from '@angular-mdl/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MaterializeModule
} from 'ng2-materialize';

import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';

import { UserService } from './shared/user.service';

import { UserComponent } from './user.component';
import { UserEntryComponent } from './user-entry/user-entry.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { AlmostThereComponent } from './user-register/almost-there.component';

@NgModule({
  imports: [
    SharedModule,
    FlexLayoutModule,
    MdlButtonModule,
    MdlTextFieldModule,
    MaterializeModule,
    ReactiveFormsModule,
    FormsModule,

    UserRoutingModule
  ],
  declarations: [
    AlmostThereComponent,
    UserComponent,
    UserEntryComponent,
    UserRegisterComponent,
  ],
  providers: [UserService]
})
export class UserModule { }
