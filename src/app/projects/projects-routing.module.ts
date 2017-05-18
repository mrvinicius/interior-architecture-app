import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/auth.guard';
import { CanDeactivateGuard } from '../core/can-deactivate-guard.service';
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
          { path: '', component: ProjectListComponent },
          {
            path: ':title', component: ProjectManagerComponent,
            resolve: { project: ProjectManagerResolver },
            canDeactivate: [CanDeactivateGuard]
          },
          // { path: ':title/:ambience-title', component: ProjectAmbienceComponent, },
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    ProjectManagerResolver
  ]
})
export class ProjectsRoutingModule { }

export const routedComponents = [ProjectsComponent];