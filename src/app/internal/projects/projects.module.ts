import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdInputModule } from '@angular/material';
import { MdlTextFieldModule } from 'angular2-mdl';

import { FlexLayoutModule } from '@angular/flex-layout';

import { ProjectsService } from './shared/projects.service';

import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { NewProjectDialogComponent } from './project-list/new-project-dialog.component';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectInfoComponent } from './project-info/project-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdInputModule,
    MdlTextFieldModule,
    FlexLayoutModule,
    ProjectsRoutingModule
  ],
  declarations: [
    ProjectsComponent,
    ProjectListComponent,
    ProjectInfoComponent,
    NewProjectDialogComponent
  ],
  providers: [ProjectsService],
  entryComponents: [NewProjectDialogComponent]
})
export class ProjectsModule { }
