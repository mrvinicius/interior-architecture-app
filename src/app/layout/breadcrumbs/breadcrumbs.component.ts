import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { IBreadcrumb } from '../shared/breadcrumb';
import { BreadcrumbsService } from '../shared/breadcrumbs.service';

@Component({
  selector: 'mb-breadcrumb',
  styleUrls: ['./breadcrumbs.component.scss'],
  template: `
    <div class="mb-breadcrumbs">
      <ng-container *ngFor="let bc of breadcrumbs; let last = last; let i = index">
        <a *ngIf="!last"
          [routerLink]="[bc.url]"
          class="breadcrumb">
          <ng-container *ngIf="breadcrumbs.length > 2">
            <span class="hide-on-small-only">{{bc.label}}</span>  
            <span class="show-on-small" style="display: none;">...</span>  
          </ng-container>
          <ng-container *ngIf="breadcrumbs.length <= 2">
            {{bc.label}}
          </ng-container>
        </a>
        <span *ngIf="last" class="breadcrumb">{{bc.label}}</span>      
      </ng-container>
    </div>

    <!-- example -->
    <ul *ngIf="false" [class.breadcrumb]="useBootstrap">
      <li *ngFor="let url of _urls; let last = last" [ngClass]="{'breadcrumb-item': useBootstrap, 'active': last}"> <!-- disable link of last item -->
        <a role="button" *ngIf="!last && url == prefix" (click)="navigateTo('/')">{{url}}</a>
        <a role="button" *ngIf="!last && url != prefix" (click)="navigateTo(url)">{{friendlyName(url)}}</a>
        <span *ngIf="last">{{friendlyName(url)}}</span>
        <span *ngIf="last && url == prefix">{{friendlyName('/')}}</span>
      </li>
    </ul>
  `
})
export class BreadcrumbsComponent implements OnInit {
  @Input() prefix: string = ''; // Static initial Breadcrumb

  public breadcrumbs: IBreadcrumb[];
  public _urls: string[];
  public _routerSubscription: any;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private bcService: BreadcrumbsService
  ) {
    this.breadcrumbs = [];
  }

  ngOnInit() {
    this._urls = new Array();   

    this._routerSubscription = this.router.events.subscribe((navigationEnd: NavigationEnd) => {

      if (navigationEnd instanceof NavigationEnd) {
        this._urls.length = 0; //Fastest way to clear out array

        this.breadcrumbs = this.bcService.buildBreadcrumbTrail(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
      }
    });

    // const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";

    // //subscribe to the NavigationEnd event
    // this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {

    //   //set breadcrumbs
    //   let root: ActivatedRoute = this.activatedRoute.root;
    //   this.breadcrumbs = this.getBreadcrumbs(root);
    // });
  }

  // getBreadcrumbs(): IBreadcrumb[] {
  //   return this.bcService.buildBreadcrumbTrail();
  // }

  // private getBreadcrumbs(route: ActivatedRoute, url: string = "", breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
  //   const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";

  //   //get the child routes
  //   let children: ActivatedRoute[] = route.children;

  //   //return if there are no more children
  //   if (children.length === 0) {
  //     return breadcrumbs;
  //   }

  //   //iterate over each children
  //   for (let child of children) {
  //     // //verify primary route
  //     // if (child.outlet !== PRIMARY_OUTLET) {
  //     //   continue;
  //     // }

  //     //verify the custom data property "breadcrumb" is specified on the route
  //     if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
  //       return this.getBreadcrumbs(child, url, breadcrumbs);
  //     }

  //     //get the route's URL segment
  //     let routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");

  //     //append route URL to URL
  //     url += `/${routeURL}`;

  //     //add breadcrumb
  //     let breadcrumb: IBreadcrumb = {
  //       label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
  //       params: child.snapshot.params,
  //       url: url
  //     };
  //     breadcrumbs.push(breadcrumb);

  //     //recursive
  //     return this.getBreadcrumbs(child, url, breadcrumbs);
  //   }

  //   //we should never get here, but just in case
  //   return breadcrumbs;
  // }
}
