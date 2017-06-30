import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MdlModule, MdlLayoutModule } from '@angular-mdl/core';
import { MdlPopoverModule } from '@angular-mdl/popover';
import { MaterializeModule } from 'ng2-materialize';

import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { BreadcrumbResolver } from './shared/breadcrum-resolver.service';
import { BreadcrumbsService } from './shared/breadcrumbs.service';
import { LayoutComponent } from './layout.component';
import { LayoutContentService } from './shared/layout-content.service';
import { LayoutHeaderService } from './shared/layout-header.service';
import { LayoutSidebarService } from './shared/layout-sidebar.service';

@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    MdlModule,
    MdlLayoutModule,
    MdlPopoverModule,
    RouterModule
  ],
  exports: [LayoutComponent],
  declarations: [LayoutComponent, BreadcrumbsComponent],
  providers: [],
})
export class LayoutModule {
  constructor( @Optional() @SkipSelf() parentModule: LayoutModule) {
    if (parentModule) {
      throw new Error(
        'LayoutModule is already loaded. Import it in the AppModule only');
    }
  }
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LayoutModule,
      // Add Services that should have only one instance - Singletons - App-wide
      providers: [
        BreadcrumbsService,
        BreadcrumbResolver,
        LayoutContentService,
        LayoutHeaderService,
        LayoutSidebarService
      ]
    };
  }
}
