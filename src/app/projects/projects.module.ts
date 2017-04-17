import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutModule } from '../layout/layout.module';

import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './project-list/project-list.component';

import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    ProjectsRoutingModule
  ],
  declarations: [
    ProjectsComponent,
    ProjectListComponent
  ]
})
export class ProjectsModule { }
