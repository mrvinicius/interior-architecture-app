import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessionalService } from './shared/professional.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [ProfessionalService]
})
export class ProfessionalModule { }
