import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientComponent } from './client.component';
import { ClientListComponent } from './client-list/client-list.component';

const routes: Routes = [
    { path: '', component: ClientComponent }
    // {
    //     path: '', component: ClientComponent,
    //     children: [
    // { path: '', redirectTo: 'clientes', pathMatch: 'full' },
    // { path: 'clientes', component: ClientListComponent }
    //     ]
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClientRoutingModule { }

// export const routedComponents = [ClientComponent];
