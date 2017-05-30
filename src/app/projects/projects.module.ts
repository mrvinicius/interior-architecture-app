import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterializeModule } from 'ng2-materialize';
import { Md2Module, Md2AccordionModule } from 'md2';
import { MdlExpansionPanelModule } from '@angular-mdl/expansion-panel';
import { MdlPopoverModule } from '@angular-mdl/popover';
import { MdlSelectModule } from '@angular-mdl/select';

import { AmbienceService } from './shared/ambience.service';
import { LayoutModule } from '../layout/layout.module';
import { NewPartnerModalComponent } from './project-manager/new-partner-modal.component';
import { NewProjectModalComponent } from './project-list/new-project-modal.component';
import { ProjectsService } from './shared/projects.service';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectManagerComponent } from './project-manager/project-manager.component';
import { ProjectsComponent } from './projects.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProposalService } from './shared/proposal.service';
import { SharedModule } from '../shared/shared.module';

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
        AmbienceService,
        ProposalService,
        ProjectsService,
      ]
    };
  }
}
