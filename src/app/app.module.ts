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
  MdlModule,
  MdlLayoutModule,
  MdlTextFieldModule,
  MdlButtonModule,
} from 'angular2-mdl';

import { 
  MaterializeModule
} from 'ng2-materialize';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';

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
    
    /** Material 2 **/
    // MaterialModule.forRoot(),
    // MdDialogModule.forRoot(),
    // MdIconModule.forRoot(),
    // MdInputModule.forRoot(),
    // FlexLayoutModule.forRoot(),

    /** MDL 2 **/
    MdlModule,
    MdlButtonModule.forRoot(),
    MdlLayoutModule.forRoot(),
    MdlTextFieldModule.forRoot(),
    // MdlExpansionPanelModule.forRoot(),
    // MdlSelectModule.forRoot(),

    /** Ng2 Materialize **/
    MaterializeModule.forRoot(),

    UserModule,
    AppRoutingModule
  ],
  providers: [],
})
export class AppModule { }
