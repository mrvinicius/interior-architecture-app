import { NgModule } from '@angular/core';
import { MdlModule, MdlLayoutModule } from '@angular-mdl/core';

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
