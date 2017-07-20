import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlmostThereComponent } from './user-register/almost-there.component';
import { AuthGuard } from './../core/auth.guard';
import { NoAuthGuard } from './../core/no-auth.guard';
import { UserComponent } from './user.component';
import { UserEntryComponent } from './user-entry/user-entry.component';
import { UserPasswordComponent } from './user-password/user-password.component';
import { UserProfessionComponent } from './user-profession/user-profession.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserRecoveryComponent } from './user-recovery/user-recovery.component';
import { UserRegisterComponent } from './user-register/user-register.component';

const routes: Routes = [
    // {
    //     path: '', component: UserComponent,
    //     children: [
    // { path: '', redirectTo: '/entrar', pathMatch: 'full' },
    { path: 'entrar', component: UserEntryComponent, canActivate: [NoAuthGuard] },
    { path: 'cadastro', redirectTo: '/', pathMatch: 'full', canActivate: [NoAuthGuard] },
    { path: 'quase-la', component: AlmostThereComponent, canActivate: [NoAuthGuard] },
    { path: 'perfil', data: { breadcrumb: 'Perfil' }, component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'recuperar', component: UserRecoveryComponent },
    { path: 'senha', component: UserPasswordComponent },
    { path: 'profissao', component: UserProfessionComponent }
    //     ]
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserRoutingModule { }
