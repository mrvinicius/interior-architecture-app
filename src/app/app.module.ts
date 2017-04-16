import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// import { FlexLayoutModule } from '@angular/flex-layout';
// import {
//   MaterialModule,
//   MdDialogModule,
//   MdIconModule,
//   MdInputModule,
// } from '@angular/material';
// import { MdlExpansionPanelModule } from '@angular2-mdl-ext/expansion-panel';
// import { MdlSelectModule } from '@angular2-mdl-ext/select';
import {
  MdlButtonModule,
  MdlIconModule,
  MdlModule,
  MdlTextFieldModule,
} from 'angular2-mdl';

import { MaterializeModule } from 'ng2-materialize';

/* App Root */
import { AppComponent } from './app.component';

/* Feature Modules */
import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { LayoutModule } from './layout/layout.module';
import { ProjectsModule } from './projects/projects.module';

/* Routing Module */
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CoreModule.forRoot(),
    UserModule,
    LayoutModule,
    ProjectsModule,

    /** Material 2 **/
    // MaterialModule.forRoot(),
    // MdDialogModule.forRoot(),
    // MdIconModule.forRoot(),
    // MdInputModule.forRoot(),
    // FlexLayoutModule.forRoot(),

    /** MDL 2 **/
    // MdlModule,
    // MdlButtonModule.forRoot(),
    // MdlIconModule.forRoot(),
    // MdlTextFieldModule.forRoot(),
    // MdlExpansionPanelModule.forRoot(),
    // MdlSelectModule.forRoot(),

    /** Ng2 Materialize **/
    MaterializeModule.forRoot(),

    AppRoutingModule
  ],
  providers: [],
})
export class AppModule { }
