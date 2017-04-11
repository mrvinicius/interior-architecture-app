import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent }   from './user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserEntryComponent } from './user-entry/user-entry.component';

const routes: Routes = [
    {
        path: '', component: UserComponent,
        children: [
            { path: 'entrar', component: UserEntryComponent },
            { path: 'perfil', component: UserProfileComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserRoutingModule { }
