import { NgModule, ModuleWithProviders } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MdlTextFieldModule } from 'angular2-mdl';

import { SharedModule } from '../../shared/shared.module';
import { ClientsService } from '../client/shared/clients.service';

import { ProjectsService } from './shared/projects.service';

import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { NewProjectDialogComponent } from './project-list/new-project-dialog.component';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectInfoComponent } from './project-info/project-info.component';

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
    NewProjectDialogComponent
  ],
  providers: [ProjectsService, ClientsService],
  entryComponents: [NewProjectDialogComponent]
})
export class ProjectsModule {}
