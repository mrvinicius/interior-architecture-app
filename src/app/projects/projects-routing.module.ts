import { ProjectsService } from './shared/projects.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from '../core/auth.guard';
import { BreadcrumbResolver } from '../layout/shared/breadcrum-resolver.service';
import { CanDeactivateGuard } from '../core/can-deactivate-guard.service';
import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectManagerComponent } from './project-manager/project-manager.component';
import { ProjectManagerResolver } from './shared/project-manager-resolver.service';
import { ProjectProposalPreviewComponent } from './project-proposal-preview/project-proposal-preview.component';
import { ProjectProposalPreviewResolver } from './shared/project-proposal-preview-resolver.service';

const routes: Routes = [
  {
    path: 'projetos',
    component: ProjectsComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Propostas' },
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        data: { breadcrumb: undefined },
        children: [
          { path: '', component: ProjectListComponent },
          {
            path: ':title', component: ProjectManagerComponent,
            resolve: {
              project: ProjectManagerResolver,
              breadcrumb: ProjectsService,
              // breadcrumb: 'projectBcResolver'
            },
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: ':title/proposta/:id', component: ProjectProposalPreviewComponent,
            resolve: { project: ProjectProposalPreviewResolver, }
          }
        ]
      }
    ]
  },
];

class DataService {}

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    ProjectManagerResolver,
    ProjectProposalPreviewResolver,
    // {
    //   provide: 'projectBcResolver',
    //   useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    //     console.log('route: ', route);
    //     console.log('state: ', state);
    //   },
    //   useExisting: DataService,
    //   useClass: ProjectsService
    // }
  ]
})
export class ProjectsRoutingModule { }

export const routedComponents = [ProjectsComponent];
