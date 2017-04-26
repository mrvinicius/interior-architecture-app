import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterializeModule } from 'ng2-materialize';
import { Md2Module, Md2AccordionModule } from 'md2';
import { MdlExpansionPanelModule } from '@angular-mdl/expansion-panel';
import { MdlPopoverModule } from '@angular-mdl/popover';
import { MdlSelectModule } from '@angular-mdl/select';

import { LayoutModule } from '../layout/layout.module';

import { ProjectsService } from './shared/projects.service';

import { NewProjectModalComponent } from './project-list/new-project-modal.component';
import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectManagerComponent } from './project-manager/project-manager.component';
import { NewPartnerModalComponent } from './project-manager/new-partner-modal.component';

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
    MdlPopoverModule,
    MdlSelectModule,
    ReactiveFormsModule,
    ProjectsRoutingModule
  ],
  declarations: [
    NewPartnerModalComponent,
    NewProjectModalComponent,
    ProjectsComponent,
    ProjectListComponent,
    ProjectManagerComponent
  ],
  providers: [ProjectsService],
  entryComponents: [
    NewPartnerModalComponent,
    NewProjectModalComponent
  ]
})
export class ProjectsModule { }
