import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { SearchFieldComponent } from './search-field/search-field.component';
import { TopbarComponent } from './topbar/topbar.component';

import { SearchService } from './search-field/search.service'

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
  declarations: [
    BreadcrumbsComponent,
    ConfirmDialogComponent,
    SearchFieldComponent,
    TopbarComponent
  ],
  exports: [
    BreadcrumbsComponent,
    CommonModule,
    ConfirmDialogComponent,
    FormsModule,
    SearchFieldComponent,
    TopbarComponent
  ],
  providers: [
    SearchService
  ]
})
export class SharedModule { }
