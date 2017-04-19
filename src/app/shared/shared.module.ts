import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
// import {
//   MdInputModule,
//   MdIconModule,
// } from '@angular/material';
// import {
//   MdlExpansionPanelModule
// } from '@@angular-mdl-ext/expansion-panel';
// import {
//   MdlSelectModule
// } from '@@angular-mdl-ext/select';
// import {
//   MdlModule,
//   MdlTextFieldModule,
// } from '@angular-mdl';
// import { Md2AccordionModule } from 'md2';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [],
  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    // MdInputModule,
    // MdIconModule,
    // MdlModule,
    // MdlTextFieldModule,
    // MdlExpansionPanelModule,
    // MdlSelectModule,
    // Md2AccordionModule
  ],
  providers: []
})
export class SharedModule {}
