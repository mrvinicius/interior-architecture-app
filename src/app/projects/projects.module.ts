import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterializeModule } from 'ng2-materialize';
import { Md2Module, Md2AccordionModule } from 'md2';
import { MdlExpansionPanelModule } from '@angular-mdl/expansion-panel';
import { MdlPopoverModule } from '@angular-mdl/popover';
import { MdlSelectModule } from '@angular-mdl/select';

import { SharedModule } from '../shared/shared.module';
import { LayoutModule } from '../layout/layout.module';
import { ProjectsService } from './shared/projects.service';
import { AmbienceService } from './shared/ambience.service';
import { NewProjectModalComponent } from './project-list/new-project-modal.component';
import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectManagerComponent } from './project-manager/project-manager.component';
import { NewPartnerModalComponent } from './project-manager/new-partner-modal.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectAmbienceComponent } from './project-ambience/project-ambience.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    SharedModule,
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
    ProjectManagerComponent,
    ProjectAmbienceComponent
  ],
  providers: [],
  entryComponents: [
    NewPartnerModalComponent,
    NewProjectModalComponent
  ]
})
export class ProjectsModule {
  constructor( @Optional() @SkipSelf() parentModule: ProjectsModule) {
    if (parentModule) {
      throw new Error(
        'ProjectsModule is already loaded. Import it in the AppModule only');
    }
  }
  static forRoot(): ModuleWithProviders {    
    return {
      ngModule: ProjectsModule,
      // Add Services that should have only one instance - Singletons - App-wide
      providers: [
        ProjectsService,
        AmbienceService
      ]
    };
  }
}
