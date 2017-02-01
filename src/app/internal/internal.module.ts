import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdInputModule ,MdDialogModule } from '@angular/material';
import { MdlModule } from 'angular2-mdl';
import { MdlTableModule, MdlTextFieldModule } from 'angular2-mdl';

import { ToolbarService } from './shared/toolbar/shared/toolbar.service';

import { InternalComponent } from './internal.component';
import { InternalRoutingModule } from './internal-routing.module';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { ToolbarSearchComponent } from './shared/toolbar/toolbar-search/toolbar-search.component';

@NgModule({
  imports: [
    CommonModule,
    MdlModule,
    MdlTextFieldModule.forRoot(),
    MdlTableModule.forRoot(),
    MdDialogModule.forRoot(),
    InternalRoutingModule,
  ],
  declarations: [
    InternalComponent,
    ToolbarComponent,
    ToolbarSearchComponent
  ],
  entryComponents: [ToolbarSearchComponent],
  providers: [ToolbarService]
})
export class InternalModule { }
