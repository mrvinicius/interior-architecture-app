import {
  ModuleWithProviders, NgModule,
  Optional, SkipSelf
} from '@angular/core';
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

import { AlmostThereComponent } from './user-register/almost-there.component';
import { UserComponent } from './user.component';
import { UserEntryComponent } from './user-entry/user-entry.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserRecoveryComponent } from './user-recovery/user-recovery.component';
import { UserPasswordComponent } from './user-password/user-password.component';
import { UserProfessionComponent } from './user-profession/user-profession.component';
import { UserService } from './shared/user.service';
import { IncompleteProfileModalComponent } from './incomplete-profile-modal/incomplete-profile-modal.component';

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
    UserProfessionComponent,
    IncompleteProfileModalComponent,
  ],
  providers: [],
  entryComponents: [IncompleteProfileModalComponent]
})
export class UserModule {
  constructor( @Optional() @SkipSelf() parentModule: UserModule) {
    if (parentModule) {
      throw new Error(
        'UserModule is already loaded. Import it in the AppModule only');
    }
  }
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UserModule,
      // Add Services that should have only one instance - Singletons - App-wide
      providers: [
        UserService
      ]
    };
  }
}
