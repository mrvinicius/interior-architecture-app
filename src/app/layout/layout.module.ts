import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MdlModule, MdlLayoutModule } from '@angular-mdl/core';

import { LayoutComponent } from './layout.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { BreadcrumbsService } from './shared/breadcrumbs.service';

@NgModule({
  imports: [
    CommonModule,
    MdlModule,
    MdlLayoutModule,
    RouterModule
  ],
  exports: [LayoutComponent],
  declarations: [LayoutComponent, BreadcrumbsComponent],
  providers: [
    BreadcrumbsService
  ],
})
export class LayoutModule { }
