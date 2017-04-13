import { NgModule, ModuleWithProviders } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MdlTextFieldModule } from 'angular2-mdl';

import { SharedModule } from '../../shared/shared.module';
import { ClientsService } from '../client/shared/clients.service';

import { ProjectsService } from './shared/projects.service';

import { NewProPartnerDialogComponent } from './project-info/new-pro-partner-dialog.component';
import { NewProjectDialogComponent } from './project-list/new-project-dialog.component';
import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectInfoComponent } from './project-info/project-info.component';

import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
  imports: [
    SharedModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    
    ProjectsRoutingModule
  ],
  declarations: [
    ProjectsComponent,
    ProjectListComponent,
    ProjectInfoComponent,
    NewProjectDialogComponent,
    NewProPartnerDialogComponent,
  ],
  providers: [ProjectsService, ClientsService],
  entryComponents: [
    NewProjectDialogComponent,
    NewProPartnerDialogComponent
  ]
})
export class ProjectsModule { }
