import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingComponent } from './billing.component';

import { AuthGuard } from '../core/auth.guard';

const routes: Routes = [
    {
        path: 'assinatura',
        component: BillingComponent,
        data: { breadcrumb: 'Assinatura' },
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