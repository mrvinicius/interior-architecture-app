import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './project-list/project-list.component';

const routes: Routes = [
  { path: '', component: ProjectsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule { }

export const routedComponents = [ProjectsComponent,ProjectListComponent];