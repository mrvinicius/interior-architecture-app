import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterializeModule } from 'ng2-materialize';

/* App Root */
import { AppComponent } from './app.component';

/* Feature Modules */
import { BudgetsModule } from './budgets/budgets.module';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { SupplierModule } from './supplier/supplier.module';
import { UserModule } from './user/user.module';

import { SignupModalComponent } from './home/signup-modal.component';

/* Routing Module */
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';

registerLocaleData(localePt, 'pt-BR');

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
    ReactiveFormsModule,
    MaterializeModule,
    UserModule.forRoot(),
    BudgetsModule,
    CoreModule.forRoot(),
    SupplierModule,
    LayoutModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  entryComponents: [SignupModalComponent]
})
export class AppModule { }
