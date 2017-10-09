import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MdlLayoutModule } from '@angular-mdl/core';
import { MdlPopoverModule } from '@angular-mdl/popover';
import { MdlSelectModule } from '@angular-mdl/select';
import { Md2Module, Md2AccordionModule } from 'md2';
import { MaterializeModule } from 'ng2-materialize';
import { NgUploaderModule } from 'ngx-uploader';
import { TagInputModule } from 'ng2-tag-input';
import { GalleryModule, GalleryConfig } from 'ng-gallery';

import { AmbienceService } from './shared/ambience.service';
import { BudgetService } from './shared/budget.service';
import { LayoutModule } from '../layout/layout.module';
import { NewBudgetModalComponent } from './new-budget-modal/new-budget-modal.component';
import { NewPartnerModalComponent } from './project-proposal-manager/new-partner-modal.component';
import { NewProjectModalComponent } from './project-list/new-project-modal.component';
import { ProjectsService } from './shared/projects.service';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectManagerComponent } from './project-manager/project-manager.component';
import { ProjectsComponent } from './projects.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProposalService } from './shared/proposal.service';
import { ProjectProposalPreviewComponent } from './project-proposal-preview/project-proposal-preview.component';
import { ProjectProposalManagerComponent } from './project-proposal-manager/project-proposal-manager.component';
import { ProjectBudgetManagerComponent } from './project-budget-manager/project-budget-manager.component';
import { ProjectGalleryComponent } from './project-gallery/project-gallery.component';
import { SharedModule } from '../shared/shared.module';


export const galleryConfig: GalleryConfig = {
  "gestures": true,
  "style": {
    "background": "#121519",
    "width": "900px",
    "height": "600px"
  },
  "animation": "fade",
  "loader": {
    "width": "50px",
    "height": "50px",
    "position": "center",
    "icon": "oval"
  },
  "description": {
    "position": "bottom",
    "overlay": false,
    "text": true,
    "counter": true
  },
  "player": {
    "autoplay": false,
    "speed": 3000
  },
  "thumbnails": {
    "width": 120,
    "height": 90,
    "position": "top",
    "space": 20
  },
}


@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    MaterializeModule,
    Md2Module,
    LayoutModule,
    Md2AccordionModule,
    MdlLayoutModule,
    MdlPopoverModule,
    MdlSelectModule,
    TagInputModule,
    ReactiveFormsModule,
    NgUploaderModule,
    GalleryModule.forRoot(galleryConfig),

    BrowserAnimationsModule,
    ProjectsRoutingModule
  ],
  declarations: [
    NewBudgetModalComponent,
    NewPartnerModalComponent,
    NewProjectModalComponent,
    ProjectsComponent,
    ProjectListComponent,
    ProjectManagerComponent,
    ProjectProposalPreviewComponent,
    ProjectProposalManagerComponent,
    ProjectBudgetManagerComponent,
    ProjectGalleryComponent
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
        BudgetService
      ]
    };
  }
}
