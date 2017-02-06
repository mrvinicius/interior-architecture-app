import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InternalComponent } from './internal.component';

const routes: Routes = [
    {
        path: '', component: InternalComponent,
        children: [
            // { path: 'projetos', redirectTo: '/projetos', pathMatch: 'full' },
            { path: 'clientes', loadChildren: './client/client.module#ClientModule' },
            { path: 'projetos', loadChildren: './projects/projects.module#ProjectsModule' },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InternalRoutingModule { }

export const routedComponents = [InternalComponent];
