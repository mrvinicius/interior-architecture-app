import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectListComponent } from './project-list.component';
import { ProjectComponent } from './project/project.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/projetos',
        pathMatch: 'full'
    },
    {
        path: 'projetos',
        component: ProjectListComponent,
        data: { title: 'Projetos' },
        // children: [
        //     { path: ':title', component: ProjectComponent, data: { title: this.path } }
        // ]
    },
    {
        path: 'projetos/:title',
        component: ProjectComponent
    },
    {
        path: 'projetos/:id/:title',
        component: ProjectComponent,
        data: { title: 'Projeto X' }
    }
    // , { path: 'projetoss', component: ProjectComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule { }
