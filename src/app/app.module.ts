import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterializeModule } from 'ng2-materialize';

// import { FlexLayoutModule } from '@angular/flex-layout';

/* App Root */
import { AppComponent } from './app.component';

/* Feature Modules */
import { BillingModule } from './billing/billing.module';
import { ClientModule } from './client/client.module';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { ProjectsModule } from './projects/projects.module';
import { UserModule } from './user/user.module';

import { SignupModalComponent } from './home/signup-modal.component';

/* Routing Module */
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HomeComponent,
    SignupModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    MaterializeModule,
    UserModule,
    CoreModule.forRoot(),

    LayoutModule.forRoot(),
    ProjectsModule.forRoot(),
    ClientModule.forRoot(),
    BillingModule.forRoot(),
  
    AppRoutingModule
  ],
  providers: [],
  entryComponents: [SignupModalComponent]
})
export class AppModule { }
