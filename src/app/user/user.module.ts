import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MdlModule,
  MdlButtonModule,
  MdlTextFieldModule,
} from '@angular-mdl/core';
// import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MaterializeModule
} from 'ng2-materialize';

import { SharedModule } from '../shared/shared.module';
import { LayoutModule } from '../layout/layout.module';
import { UserRoutingModule } from './user-routing.module';

import { UserComponent } from './user.component';
import { UserEntryComponent } from './user-entry/user-entry.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { AlmostThereComponent } from './user-register/almost-there.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserRecoveryComponent } from './user-recovery/user-recovery.component';
import { UserPasswordComponent } from './user-password/user-password.component';

@NgModule({
  imports: [
    SharedModule,
    // FlexLayoutModule,
    MdlButtonModule,
    MdlTextFieldModule,
    MaterializeModule,
    ReactiveFormsModule,
    FormsModule,
    LayoutModule,

    UserRoutingModule
  ],
  declarations: [
    AlmostThereComponent,
    UserComponent,
    UserEntryComponent,
    UserRegisterComponent,
    UserProfileComponent,
    UserRecoveryComponent,
    UserPasswordComponent,
  ],
  providers: []
})
export class UserModule { }
