import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { ProjectsRoutingModule } from './projects-routing.module';

import { ProjectsService } from './shared/projects.service';

import { ProjectListComponent } from './project-list.component';
import { NewProjectDialogComponent } from './new-project-dialog-component/new-project-dialog.component';
import { ProjectComponent } from './project/project.component';

@NgModule({
  imports: [
    ProjectsRoutingModule,
    SharedModule
  ],
  declarations: [
    ProjectListComponent,
    ProjectComponent,
    NewProjectDialogComponent
  ],
  providers: [ProjectsService],
  entryComponents: [NewProjectDialogComponent]
})
export class ProjectsModule {

}
