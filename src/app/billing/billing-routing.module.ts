import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingComponent } from './billing.component';

import { AuthGuard } from './../core/auth.guard';

const routes: Routes = [
    {
        path: 'faturamento',
        component: BillingComponent,
        data: { breadcrumb: 'Faturamento' },
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                canActivateChild: [AuthGuard],
                data: { breadcrumb: undefined },
                children: [

                ]
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BillingRoutingModule {

}