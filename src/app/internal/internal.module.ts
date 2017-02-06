import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BudgetsModule } from './budgets/budgets.module';
import { ToolbarService } from './shared/toolbar/shared/toolbar.service';

import { InternalComponent } from './internal.component';
import { InternalRoutingModule } from './internal-routing.module';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { ToolbarSearchComponent } from './shared/toolbar/toolbar-search/toolbar-search.component';

@NgModule({
  imports: [
    SharedModule,
    BudgetsModule,
    InternalRoutingModule,
  ],
  declarations: [
    InternalComponent,
    ToolbarComponent,
    ToolbarSearchComponent
  ],
  entryComponents: [ToolbarSearchComponent],
  providers: [ToolbarService]
})
export class InternalModule { }
