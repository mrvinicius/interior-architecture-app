import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './project-list/project-list.component';

import { ProjectsRoutingModule, routedComponents } from './projects-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ProjectsRoutingModule
  ],
  declarations: [
    ProjectsComponent,
    ProjectListComponent
  ]
})
export class ProjectsModule { }
