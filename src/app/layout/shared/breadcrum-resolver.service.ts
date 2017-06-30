import { Injectable } from '@angular/core';
import {
    Router,
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BreadcrumbResolver implements Resolve<string> {
    constructor(
        private router: Router
    ) { }

    breadcrumbLabelDefinedSource = new Subject<string>();
    private breadcrumbLabelDefined$ = this.breadcrumbLabelDefinedSource.asObservable();

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log(this.breadcrumbLabelDefined$);
        return Observable.of('Projeto qualquer')
        // return this.breadcrumbLabelDefined$;
        // return this.breadcrumbLabelDefined$.map((label: string) => {
        //     console.log(label);

        //     return label;
        // }).first();
    }
}
