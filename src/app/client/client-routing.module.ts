import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/auth.guard';
import { ClientComponent } from './client.component';
import { ClientListComponent } from './client-list/client-list.component';

const routes: Routes = [
    {
        path: 'clientes', component: ClientComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                canActivateChild: [AuthGuard],
                children: [
                    { path: '', component: ClientListComponent, data: { breadcrumb: 'Clientes' } },
                ]
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClientRoutingModule { }

export const routedComponents = [ClientComponent];