import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MaterialModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
} from '@angular/material';
import { MdlExpansionPanelModule } from '@angular2-mdl-ext/expansion-panel';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import {
  MdlModule,
  MdlLayoutModule,
  MdlTextFieldModule,
} from 'angular2-mdl';
import { Md2AccordionModule } from 'md2';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { UsersModule } from './users/users.module';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CoreModule.forRoot(),
    UsersModule,

    // Material 2
    MaterialModule.forRoot(),
    MdDialogModule.forRoot(),
    MdIconModule.forRoot(),
    MdInputModule.forRoot(),
    FlexLayoutModule.forRoot(),

    // MDL 2
    MdlModule,
    MdlLayoutModule.forRoot(),
    MdlTextFieldModule.forRoot(),
    MdlExpansionPanelModule.forRoot(),
    MdlSelectModule.forRoot(),

    AppRoutingModule
  ],
  providers: [],
})
export class AppModule { }
