import { ProjectAmbienceResolver } from './shared/project-ambience-resolver.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/auth.guard';
import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectManagerComponent } from './project-manager/project-manager.component';
import { ProjectAmbienceComponent } from './project-ambience/project-ambience.component';
import { ProjectManagerResolver } from './shared/project-manager-resolver.service';

const routes: Routes = [
  {
    path: 'projetos',
    component: ProjectsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          {
            path: '',
            component: ProjectListComponent
          },
          {
            path: ':title',
            component: ProjectManagerComponent,
            resolve: { project: ProjectManagerResolver },
            children: [
              // {
              //   path: ':ambience-title',
              //   component: ProjectAmbienceComponent,
              //   // resolve: { ambience: ProjectAmbienceResolver }
              // }
            ]
          },
          {
            path: ':title/:ambience-title',
            component: ProjectAmbienceComponent,
            // resolve: { ambience: ProjectAmbienceResolver }
          },
          // { path: ':title/ambiente/:ambience-title', component: ProjectAmbienceComponent, resolve: { ambience: ProjectAmbienceResolver } },
          // { path: 'ambiente/:ambience-title', component: ProjectAmbienceComponent },
          // { path: 'ambiente/novo', component: ProjectAmbienceComponent, data: { breadcrumb: 'Ambientes' } },
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    ProjectManagerResolver,
    ProjectAmbienceResolver
  ]
})
export class ProjectsRoutingModule { }

export const routedComponents = [ProjectsComponent];