import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';
import { UserEntryComponent } from './user-entry/user-entry.component';
import { UserRegisterComponent } from "./user-register/user-register.component";

const routes: Routes = [
    {
        path: '', component: UserComponent,
        children: [
            { path: 'entrar', component: UserEntryComponent },
            { path: 'cadastro', component: UserRegisterComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserRoutingModule { }