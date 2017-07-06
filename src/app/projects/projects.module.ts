import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MdlLayoutModule } from '@angular-mdl/core';
import { MdlExpansionPanelModule } from '@angular-mdl/expansion-panel';
import { MdlPopoverModule } from '@angular-mdl/popover';
import { MdlSelectModule } from '@angular-mdl/select';
import { Md2Module, Md2AccordionModule } from 'md2';
import { MaterializeModule } from 'ng2-materialize';
import { TagInputModule } from 'ng2-tag-input';

import { AmbienceService } from './shared/ambience.service';
import { LayoutModule } from '../layout/layout.module';
import { NewPartnerModalComponent } from './project-proposal-manager/new-partner-modal.component';
import { NewProjectModalComponent } from './project-list/new-project-modal.component';
import { ProjectsService } from './shared/projects.service';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectManagerComponent } from './project-manager/project-manager.component';
import { ProjectsComponent } from './projects.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProposalService } from './shared/proposal.service';
import { SharedModule } from '../shared/shared.module';
import { ProjectProposalPreviewComponent } from './project-proposal-preview/project-proposal-preview.component';
import { ProjectProposalManagerComponent } from './project-proposal-manager/project-proposal-manager.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    MaterializeModule,
    Md2Module,
    Md2AccordionModule,
    MdlLayoutModule,
    MdlExpansionPanelModule,
    MdlPopoverModule,
    MdlSelectModule,
    TagInputModule,
    ReactiveFormsModule,
    
    BrowserAnimationsModule,
    ProjectsRoutingModule
  ],
  declarations: [
    NewPartnerModalComponent,
    NewProjectModalComponent,
    ProjectsComponent,
    ProjectListComponent,
    ProjectManagerComponent,
    ProjectProposalPreviewComponent,
    ProjectProposalManagerComponent,
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
