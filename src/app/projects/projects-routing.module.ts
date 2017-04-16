import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectInfoComponent } from './project-info/project-info.component';

const routes: Routes = [
  {
    path: '', component: ProjectsComponent,
    children: [
      { path: 'projetos', component: ProjectListComponent },
      { path: 'project-info', component: ProjectInfoComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule { }

export const routedComponents = [ProjectsComponent];