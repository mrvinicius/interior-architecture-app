import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// import { FlexLayoutModule } from '@angular/flex-layout';

/* App Root */
import { AppComponent } from './app.component';

/* Feature Modules */
import { ClientModule } from './client/client.module';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { ProjectsModule } from './projects/projects.module';
import { UserModule } from './user/user.module';

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
    UserModule,
    LayoutModule,
    ProjectsModule.forRoot(),
    ClientModule.forRoot(),
    
    CoreModule.forRoot(),
    AppRoutingModule
  ],
  providers: [],
})
export class AppModule { }
