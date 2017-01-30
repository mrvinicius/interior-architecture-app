/** 
 * Fonte: https://github.com/alalonde/ng2-breadcrumbs
 * 
*/

import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { BreadcrumbService } from './breadcrumbs.service';

@Component({
    selector: 'breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss'],
    providers: [BreadcrumbService]
})
export class BreadcrumbsComponent {
    private segments: ActivatedRoute[];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private breadcrumbLabels: BreadcrumbService
    ) {
        this.segments = new Array();
        this.router.events
            .subscribe(event => {
                if (event instanceof NavigationEnd) {
                    this.routeChanged(event);
                }
            });
    }

    public routeChanged(event: any) {
        this.segments.length = 0;
        this.generateBreadcrumbTrail(this.router.routerState.root);
    }

    public generateBreadcrumbTrail(route: ActivatedRoute): void {
        route.children.forEach(childRoute => {
            if (childRoute.outlet === "primary") {
                if (childRoute.snapshot.url.length > 0) {
                    this.segments.push(childRoute);
                }
                this.generateBreadcrumbTrail(childRoute);
            }
        });
    }

    public navigateTo(route: ActivatedRoute): void {
        this.router.navigateByUrl(this.breadcrumbLabels.buildUrl(route));
    }

    public routeName(route: ActivatedRoute): string {
        return this.breadcrumbLabels.getLabel(route);
    }
}
