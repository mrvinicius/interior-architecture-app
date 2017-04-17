import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterializeModule } from 'ng2-materialize';

import { LayoutModule } from '../layout/layout.module';

import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './project-list/project-list.component';

import { NewProjectModalComponent } from './project-list/new-project-modal.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectManagerComponent } from './project-manager/project-manager.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LayoutModule,
    MaterializeModule,
    ReactiveFormsModule,
    ProjectsRoutingModule
  ],
  declarations: [
    NewProjectModalComponent,
    ProjectsComponent,
    ProjectListComponent,
    ProjectManagerComponent
  ],
  entryComponents: [NewProjectModalComponent]
})
export class ProjectsModule { }
