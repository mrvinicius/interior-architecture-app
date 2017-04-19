import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MdlExpansionPanelModule } from '@angular-mdl/expansion-panel';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Md2Module, Md2AccordionModule } from 'md2';
import { MaterializeModule } from 'ng2-materialize';

import { LayoutModule } from '../layout/layout.module';

import { ProjectsService } from './shared/projects.service';


import { NewProjectModalComponent } from './project-list/new-project-modal.component';
import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectManagerComponent } from './project-manager/project-manager.component';

import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    LayoutModule,
    MaterializeModule,
    Md2Module,
    Md2AccordionModule,
    MdlExpansionPanelModule,
    ReactiveFormsModule,
    ProjectsRoutingModule
  ],
  declarations: [
    NewProjectModalComponent,
    ProjectsComponent,
    ProjectListComponent,
    ProjectManagerComponent
  ],
  providers: [ProjectsService],
  entryComponents: [NewProjectModalComponent]
})
export class ProjectsModule { }
