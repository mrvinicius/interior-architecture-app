import { NgModule } from '@angular/core';
import { MdlModule, MdlLayoutModule } from 'angular2-mdl';

import { LayoutComponent } from './layout.component';

@NgModule({
  imports: [
    MdlModule,
    MdlLayoutModule
  ],
  exports: [LayoutComponent],
  declarations: [LayoutComponent],
  providers: [],
})
export class LayoutModule { }
