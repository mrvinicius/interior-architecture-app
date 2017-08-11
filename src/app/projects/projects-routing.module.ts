import { ProjectGalleryComponent } from './project-gallery/project-gallery.component';
import { ProjectProposalManagerComponent } from './project-proposal-manager/project-proposal-manager.component';
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
import { ProjectsService } from './shared/projects.service';

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
            path: ':title',
            component: ProjectManagerComponent,
            canDeactivate: [CanDeactivateGuard],
            // data: {
            //   tabs: [
            //     {
            //       title: 'Proposta',
            //       selectors: 'abx-project-proposal-manager',
            //       componentData: {
            //         componentType: ProjectProposalManagerComponent,
            //       }
            //     },
            //     {
            //       title: 'Versões',
            //       selectors: 'abx-project-version-manager'
            //     },
            //     {
            //       title: 'Especificação de produto',
            //       selectors: 'abx-project-budget-manager'
            //     }
            //   ]
            // },
            resolve: {
              project: ProjectManagerResolver,
              breadcrumb: ProjectsService
            }
          },
          {
            path: ':title/proposta/:id', component: ProjectProposalPreviewComponent,
            resolve: { project: ProjectProposalPreviewResolver }
          },
          {
            path: ':title/imagens/:id', component: ProjectGalleryComponent,
            resolve: { project: ProjectProposalPreviewResolver}
          }
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
    ProjectProposalPreviewResolver
    // {
    //   provide: 'projectBcResolver',
    //   useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

    //   },
    //   useExisting: DataService,
    //   useClass: ProjectsService
    // }
  ]
})
export class ProjectsRoutingModule { }

export const routedComponents = [ProjectsComponent];
