import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';
import { UserEntryComponent } from './user-entry/user-entry.component';
import { UserRegisterComponent } from "./user-register/user-register.component";
import { AlmostThereComponent } from './user-register/almost-there.component';

const routes: Routes = [
    {
        path: '', component: UserComponent,
        children: [
            { path: '', redirectTo: '/entrar', pathMatch: 'full' },
            { path: 'entrar', component: UserEntryComponent },
            { path: 'cadastro', component: UserRegisterComponent },
            { path: 'quase-la', component: AlmostThereComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserRoutingModule { }
