import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from './shared/user.service';

import { UserLoginComponent } from './user-login/user-login.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule
  ],
  declarations: [UserLoginComponent],
  providers: [UserService]
})
export class UsersModule { }
