import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MdlModule, MdlLayoutModule } from '@angular-mdl/core';

import { LayoutComponent } from './layout.component';

@NgModule({
  imports: [
    MdlModule,
    MdlLayoutModule,
    RouterModule
  ],
  exports: [LayoutComponent],
  declarations: [LayoutComponent],
  providers: [],
})
export class LayoutModule { }
